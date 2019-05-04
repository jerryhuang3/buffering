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
  console.log('GET / is RUNNING');
  console.log('req.session.user = ', req.session.user);

  if (req.session.user) {
    console.log('There are cookies so querying the database');
    const user = await queries.getUser(req.session.user);
    if (moment(Date.now()).valueOf() >= user.expires_at + 3500000) {
      console.log('TOKEN IS OUTDATED');
      const newAccessToken = await auth.refreshAccessToken(user.refresh_token);
      await queries.setTokenExistingUser(user.google_id, newAccessToken.access_token, newAccessToken.expires_at);
      return res.json({ name: user.name, google_id: user.google_id, access_token: newAccessToken.access_token });
    }
    return res.json({ name: user.name, google_id: user.google_id, access_token: user.access_token });
  } else {
    console.log('No cookies so sending');
    res.send(false);
  }
});

app.post('/extension', async (req, res) => {
  console.log('GET / is RUNNING');
  console.log('req.session.user = ', req.session.user);

  if (req.session.user) {
    console.log('There are cookies so querying the database');
    const user = await queries.getUser(req.session.user);
    if (moment(Date.now()).valueOf() >= user.expires_at + 3500000) {
      console.log('TOKEN IS OUTDATED');
      const newAccessToken = await auth.refreshAccessToken(user.refresh_token);
      await queries.setTokenExistingUser(user.google_id, newAccessToken.access_token, newAccessToken.expires_at);
      return res.json({ name: user.name, google_id: user.google_id, access_token: newAccessToken.access_token });
    }
    return res.json({ name: user.name, google_id: user.google_id, access_token: user.access_token });
  } else {
    console.log('No cookies so sending');
    res.send(false);
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
    req.session.user = user.email; //Set user in cookie
    switch (user.type) {
      case 'google':
        console.log('google signup detected');
        await queries.insertUser(user.googleId, user.name, user.email, null, user.picture);
        await queries.setTokenNewUser(user.googleId, user.accessTok, user.refreshTok, user.accessTokExp);
        return res.json({ name: user.name, access_token: user.accessTok });
      case 'signup':
        console.log('web signup detected');
        await queries.insertUser(null, user.name, user.email, user.password, null);
        return res.redirect('/');
    }
  }
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

  // Check if user is logging in from google or not
  switch (user.type) {
    case 'google':
      console.log('google login detected');
      await queries.setTokenExistingUser(user.googleId, user.accessTok, user.accessTokExp);
      req.session.user = user.email;
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
            req.session.user = user.email; //Set user in cookie
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
  console.log('this is cookie session id: ', req.session.userid);
  req.session = null;
  return res.json(true);
});

// GOALS
app.post('/set_goal', async function(req, res) {
  console.log('SET GOAL ROUTE');
  const googleId = req.body.googleId;
  const stepsGoal = req.body.stepsGoal;
  const givenDay = req.body.givenDay; //what happens here??
  const endOfDay = moment(Date.now())
    .endOf('day')
    .valueOf(); //related to above

  // check if this goal exists then insert/update as appropriate
  const goalExists = await query.checkGoalExists(googleId, endOfDay);
  if (goalExists) {
    await query.updateGoal(googleId, stepsGoal, endOfDay);
    res.sendStatus(200);
  } else {
    await query.insertGoal(googleId, stepsGoal, endOfDay);
    res.sendStatus(200);
  }
});

app.post('/goals', async function(req, res) {
  console.log('GET GOALS ROUTE');
  const googleId = req.body.googleId;
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

  const foundGoalsAwait = await queries.pastWeekGoals(googleId, weekAgo, endOfDay);
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

  res.json({ goalHistory: goalHistory });
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
