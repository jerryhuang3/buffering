'use strict';
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const cookieSession = require('cookie-session');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const utils = require('./helpers/utils');
const queries = require('./db/queries');

// Iniitalize express and routes
const app = express();
const { users, userId, friendsList } = require('./routes/users');
const { addFriend, removeFriend, acceptFriend, checkFriend } = require('./routes/friends');
const login = require('./routes/login');
const logout = require('./routes/logout');
const signup = require('./routes/signup');
const connect = require('./routes/connect');
const { goals, checkGoal, updateGoal } = require('./routes/goals');
const initialize = require('./routes/initialize');
const demo = require('./routes/demo');
const extension = require('./routes/extension');
const data = require('./routes/data');
const leaderboard = require('./routes/leaderboard');

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

// Catch-all routes for nonexistent paths
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// Routes
app.post('/users', users);
app.post('/user/:userId', userId);
app.post('/user/:userId/data', data);
app.post('/user/:userId/friends', friendsList);
app.post('/friends/add_friend', addFriend);
app.post('/friends/accept_friend', acceptFriend);
app.post('/friends/remove_friend', removeFriend);
app.post('/friends/check_friend', checkFriend);
app.post('/login', login);
app.post('/logout', logout);
app.post('/signup', signup);
app.post('/connect', connect);
app.post('/goals', goals);
app.post('/goals/check', checkGoal);
app.post('/goals/update', updateGoal);
app.post('/initialize', initialize);
app.post('/extension', cors(), extension);
app.post('/demo', demo);
app.post('/leaderboard', leaderboard);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
