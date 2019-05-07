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
const path = require('path');
const cors = require('cors');
const queries = require('./db/queries');
const utils = require('./utils');
const moment = require('moment');
const auth = require('./auth');
const demo = require('./status-script');

// iniitalize express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'dist')));

app.use(
  cookieSession({
    name: 'session',
    keys: [process.env.SESSION_KEY],
    maxAge: 24 * 60 * 60 * 1000
  })
);

// Set's up user's initial state
app.post('/', async (req, res) => {
  // Looks up user info upon loading app
  if (req.session.user) {
    const user = await queries.getUserWithToken(req.session.user); // Works if user is connected to google

    // For users not connected to google
    if (!user) {
      const user = await queries.getUser(req.session.user);
      return res.json({ name: user.name });
    }
    // For users connected to google
    // First check if access token is expired and generate a new one if it is
    if (moment(Date.now()).valueOf() >= user.expires_at + 3500000) {
      const newAccessToken = await auth.refreshAccessToken(user.refresh_token);
      await queries.setTokenExistingUser(req.session.user, newAccessToken.access_token, newAccessToken.expires_at);
      return res.json({ name: user.name, access_token: newAccessToken.access_token, image_url: user.image_url });
    }
    return res.json({ name: user.name, access_token: user.access_token, image_url: user.image_url });
  } else {
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
        password: bcrypt.hashSync(req.body.password, 10),
        picture: `https://avatars.dicebear.com/v2/avataaars/${req.body.name.replace(/ /g, '')}.svg`
      };

  const emailExists = await queries.checkEmail(user.email);

  if (emailExists) {
    switch (user.type) {
      case 'google':
        return res.json(false);
        break;
      case 'signup':
        return res.redirect('/400/signup');
        break;
    }
  } else {
    if (user.type === 'google') {
      // Google sign up
      await queries.insertUser(user.googleId, user.name, user.email, null, user.picture);
      const id = await queries.getUserId(user.email);
      req.session.user = id.id;
      await queries.setTokenNewUser(id.id, user.accessTok, user.refreshTok, user.accessTokExp);
      return res.json({ name: user.name, access_token: user.accessTok });
    } else if (user.type === 'signup') {
      // Web sign up
      await queries.insertUser(null, user.name, user.email, user.password, user.picture);
      const id = await queries.getUserId(user.email);
      req.session.user = id.id;
      return res.redirect('/initialize');
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

  const userId = await queries.getUserId(user.email);

  // When user signs up with website, connects account to google, and tries to use google login
  if (!userId) {
    return res.redirect('/400/login');
  }

  // Check if user is logging in from google or not
  switch (user.type) {
    case 'google':
      // google login
      queries.setTokenExistingUser(userId.id, user.accessTok, user.accessTokExp);
      req.session.user = userId.id;
      queries.runningGoal(req.session.user);
      return res.json({ name: user.name, access_token: user.accessTok });
      break;
    case 'login':
      // web login
      const emailCheck = await queries.checkEmail(user.email);
      if (emailCheck) {
        if (emailCheck.password !== null) {
          const checkPassword = await queries.checkPassword(user.email, user.password);
          if (checkPassword) {
            req.session.user = userId.id; //Set user in cookie
            queries.runningGoal(req.session.user);
            return res.redirect('/');
          }
        }
        // incorrect password
        return res.redirect('/400/login');
      } else {
        // incorrect email
        return res.redirect('/400/login');
      }
      break;
  }
});

app.post('/logout', (req, res) => {
  req.session = null;
  return res.json(true);
});

app.post('/connect', async (req, res) => {
  const user = await auth.googleAuth(req.body.code);
  // Adding google info to existing account
  await queries.connectGoogle(req.session.user, user.googleId);
  await queries.setTokenNewUser(req.session.user, user.accessTok, user.refreshTok, user.accessTokExp);
  return res.json({ name: user.name, access_token: user.accessTok });
});

// GOALS
app.post('/goals/update', async function(req, res) {
  const id = req.session.user;
  const stepsGoal = req.body.steps;
  const endOfDay = moment()
    .endOf('day')
    .valueOf();
  // User can only update a goal once a day
  const canUpdate = await queries.canUserUpdateGoal(id);
  if (canUpdate) {
    queries.updateGoal(id, stepsGoal, endOfDay);
    return res.json(true);
  } else {
    return res.json(false);
  }
});

app.post('/goals', async function(req, res) {
  const id = req.session.user;
  // calculate rounded day and week ago from current time
  const today = moment().endOf('day');
  const endOfDay = today.valueOf();
  const weekAgo = moment()
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

app.post('/goals/check', async (req, res) => {
  const goalExists = await queries.checkGoalExists(req.session.user);
  if (goalExists !== 0) {
    return res.json(true);
  }
  return res.json(false);
});

app.post('/initialize', async (req, res) => {
  const id = req.session.user;
  const stepsGoal = req.body.steps;
  const today = moment().endOf('day');
  const endOfDay = today.valueOf();

  let pastWeekArray = [endOfDay];
  for (let i = 1; i < 7; i++) {
    const ithDayAgo = today.subtract(1, 'days').valueOf();
    pastWeekArray.push(ithDayAgo);
  }

  for (let k = 0; k < pastWeekArray.length; k++) {
    await queries.initializeGoal(id, stepsGoal, pastWeekArray[k]);
  }

  return res.json(true);
});

app.post('/extension', cors(), async (req, res) => {
  // if logged in send user-status else send false
  if (req.session.user) {
    const user = await queries.getUserWithToken(req.session.user);
    let currentAccessToken = user.access_token;

    // if token expired get then set new one
    if (moment(Date.now()).valueOf() >= user.expires_at + 3500000) {
      const newAccessToken = await auth.refreshAccessToken(user.refresh_token);
      await queries.setTokenExistingUser(user.id, newAccessToken.access_token, newAccessToken.expires_at);
      currentAccessToken = newAccessToken.access_token;
    }

    // init time constants
    const pastThreeDays = utils.getPastDaysIncludingToday(3);
    const today = pastThreeDays[0];
    const threeDaysAgo = pastThreeDays[pastThreeDays.length - 1];
    // get goals from db -> order and null check
    const foundGoalsAwait = await queries.pastWeekGoals(user.id, threeDaysAgo, today);
    const foundGoals = foundGoalsAwait[0];
    const goalHistory = utils.orderGoals(pastThreeDays, foundGoals);
    const goalReverse = goalHistory.reverse();
    // get steps using token
    const stepHistory = await utils.filterAndFetchSteps(currentAccessToken);
    const userStatus = utils.computeUserStatus(stepHistory, goalReverse);
    return res.json({ userStatus: userStatus });
  } else {
    return res.send(false);
  }
});

app.post('/demo', (req, res) => {
  switch (req.body.status) {
    case 'good':
      demo.makeUsersGood().then(() => {
        return res.json('All users are now good');
      });
      break;
    case 'bad':
      demo.makeUsersBad().then(() => {
        return res.json('All users are now bad');
      });
      break;
    case 'awful':
      demo.makeUsersAwful().then(() => {
        return res.json('All users are now awful');
      });
      break;
    case 'hell':
      demo.makeUsersHell().then(() => {
        return res.json('All users are now hell');
      });
      break;
  }
});

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
