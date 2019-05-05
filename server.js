'use strict';

require('dotenv').config();

// import .env
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
// local session
const cookieSession = require('cookie-session');
// import express and related libraries
const express = require('express');
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
//const sass        = require("node-sass-middleware");
const path = require('path');
//allow cross origin resource sharing
const cors = require('cors');
//import helpers
const queries = require('./db/queries');
const utils = require('./utils');
const dataUtils = require('./src/utils/data-utils');
// for generating refresh and access tokens
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
// store goals by end of day
const moment = require('moment');

const auth = require('./auth');

// iniitalize express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'dist')));

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_KEY],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  })
);

// routes
app.post('/', async (req, res) => {
  console.log('Current user: ', req.session.user);
  // Looks up user info upon loading app
  if (req.session.user) {
    const user = await queries.getUserWithToken(req.session.user); // Works if user is connected to google
    console.log(user);
    // For users not connected to google
    if (!user) {
      console.log('web user detected');
      const user = await queries.getUser(req.session.user);
      return res.json({ name: user.name, google_id: user.google_id });
    }
    // Check if access_token is expired
    if (moment(Date.now()).valueOf() >= user.expires_at + 3500000) {
      const newAccessToken = await auth.refreshAccessToken(user.refresh_token);
      await queries.setTokenExistingUser(user.google_id, newAccessToken.access_token, newAccessToken.expires_at);
      return res.json({ name: user.name, google_id: user.google_id, access_token: newAccessToken.access_token });
    }
    return res.json({ name: user.name, google_id: user.google_id, access_token: user.access_token });
  } else {
    console.log('There are no cookies');
    return res.send(false);
  }
});

app.post('/signup', async (req, res) => {
  const user = req.body.code
    ? await auth.googleAuth(req.body.code)
    : {
        type: 'signup',
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      };

  const emailExists = await queries.checkEmail(user.email);

  if (emailExists) {
    res.json(false);
  } else {
    console.log('creating account now....');
    if (user.type === 'google') {
      console.log('google signup detected');
      await queries.insertUser(user.googleId, user.name, user.email, null, user.picture);
      const id = await queries.getUserId(user.email);
      req.session.user = id.id;
      await queries.setTokenNewUser(id.id, user.accessTok, user.refreshTok, user.accessTokExp);
      return res.json({ name: user.name, access_token: user.accessTok });
    } else if (user.type === 'signup') {
      console.log('web signup detected');
      await queries.insertUser(null, user.name, user.email, user.password, null);
      const id = await queries.getUserId(user.email);
      req.session.user = id.id;
      return res.redirect('/');
    }
  }
});

app.post('/connect', async (req, res) => {
  console.log('THE CONNECT ROUTE IS WORKING~');

  const user = await auth.googleAuth(req.body.code);

  console.log('adding google info to existing account');
  await queries.connectGoogle(req.session.user, user.googleId, user.picture);
  await queries.setTokenNewUser(user.googleId, user.accessTok, user.refreshTok, user.accessTokExp);
  return res.json({ name: user.name, access_token: user.accessTok });
});

app.post('/login', async (req, res) => {
  const user = req.body.code
    ? await auth.googleAuth(req.body.code)
    : {
        type: 'login',
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };

  const userId = await queries.getUserId(user.email);
  
  // Case when user signs up with website, connects account to google, and tries to use google login
  if (!userId) {
    console.log('user not found');
    return res.json(false);
  }

  // Check if user is logging in from google or not
  switch (user.type) {
    case 'google':
      console.log('google login detected');
      queries.setTokenExistingUser(userId.id, user.accessTok, user.accessTokExp);
      req.session.user = userId.id;
      queries.runningGoal(req.session.user);
      console.log('INSERTS COMPLETED SERVER.JS');
      return res.json({ name: user.name, access_token: user.accessTok });
    case 'login':
      console.log('web login detected');
      const emailCheck = await queries.checkEmail(user.email);
      if (emailCheck) {
        console.log('email found');
        if (emailCheck.password !== null) {
          const checkPassword = await queries.checkPassword(user.email, user.password);
          if (checkPassword) {
            console.log('password matches');
            req.session.user = userId.id; //Set user in cookie
            queries.runningGoal(req.session.user);
            console.log('INSERTS COMPLETED SERVER.JS');
            return res.redirect('/');
          }
        }
        console.log('password incorrect');
        return res.redirect('/400/login');
      } else {
        console.log('email not found');
        return res.redirect('/400/login');
      }
  }
});

app.post('/logout', (req, res) => {
  console.log('This post is running');
  req.session = null;
  return res.json(true);
});

// GOALS
app.post('/goals/update', async function(req, res) {
  console.log('Updating goals now...........');
  const email = req.session.user;
  const googleId = req.body.googleId;
  const stepsGoal = req.body.steps;
  console.log('input', stepsGoal);
  const endOfDay = moment()
    .endOf('day')
    .valueOf();
  const canUpdate = await queries.canUserUpdateGoal(email);
  if (canUpdate) {
    queries.updateGoal(googleId, stepsGoal, endOfDay);
    return res.json(true);
  } else {
    console.log('user can not update goal again');
    return res.json(false);
  }
});

app.post('/goals', async function(req, res) {
  console.log('GET GOALS ROUTE');
  const id = req.session.user;
  // calculate rounded day and week ago from current time
  const today = moment(Date.now()).endOf('day');
  const endOfDay = today.valueOf();
  // const endOfDay = new Date();
  // endOfDay.setHours(23, 59, 59, 999);

  // console.log('END OF DAY', endOfDay.getTime());
  const weekAgo = moment(Date.now())
    .endOf('day')
    .subtract(7, 'days')
    .valueOf();

  const foundGoalsAwait = await queries.pastWeekGoals(id, weekAgo, endOfDay);
  const foundGoals = foundGoalsAwait[0];
  let pastWeekArray = [endOfDay];
  for (let i = 1; i < 7; i++) {
    const ithDayAgo = today.subtract(1, 'days').valueOf();
    pastWeekArray.push(ithDayAgo);
  }

  const goalHistory = pastWeekArray.map(day => {
    const dayGoal = foundGoals.filter(goalObj => parseInt(goalObj.day_rounded) === day)[0]; // errors if no goals
    return dayGoal ? dayGoal.steps_goal : 0;
  });

  return res.json({ goalHistory: goalHistory });
});

app.post('/extension', cors(), async (req, res) => {
  console.log('EXTENSION ROUTE IS WORKING');
  // if logged in send user-status else send false
  if (req.session.user) {
    console.log('There are cookies so querying the database');
    const user = await queries.getUserWithToken(req.session.user);
    console.log('USER HERE BABY:', user);
    // DOES THIS WORK ????
    let currentAccessToken = user.access_token;

    // if token expired get then set new one
    if (moment(Date.now()).valueOf() >= user.expires_at + 3500000) {
      console.log('TOKEN IS OUTDATED');
      const newAccessToken = await auth.refreshAccessToken(user.refresh_token);
      await queries.setTokenExistingUser(user.id, newAccessToken.access_token, newAccessToken.expires_at);
      currentAccessToken = newAccessToken.access_token;
    }

    // init time constants
    const pastThreeDays = utils.getPastDaysIncludingToday(3);
    const today = pastThreeDays[0];
    console.log('TODAY', moment(today).calendar());
    const threeDaysAgo = pastThreeDays[pastThreeDays.length - 1];
    console.log('THREE DAYS AGO', moment(threeDaysAgo).calendar());
    // get goals from db -> order and null check
    const foundGoalsAwait = await queries.pastWeekGoals(user.id, threeDaysAgo, today);
    const foundGoals = foundGoalsAwait[0];
    const goalHistory = utils.orderGoals(pastThreeDays, foundGoals);
    // get steps using token
    const stepHistory = await utils.filterAndFetchSteps(currentAccessToken);
    console.log('STEP HISTORY BABY!', stepHistory);
    console.log('GOAL HISTORY BABY!', goalHistory);
    const userStatus = utils.computeUserStatus(stepHistory, goalHistory);
    console.log('USER STATUS BABY!', userStatus);
    return res.json({ userStatus: userStatus });
  } else {
    console.log('No cookies so sending');
    return res.send(false);
  }
});

// TEST
const testRoutes = require('./test_routes');
app.use('/test', testRoutes);

// Catch-all routes
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// async error helpers

// const asyncMiddleware = fn =>
//   (req, res, next) => {
//     Promise.resolve(fn(req, res, next))
//       .catch(next);
//   };

// app.use(function(err, req, res, next) {
//   console.error(err)
//   res.status(500).json({message: 'an error occurred'})
// })
