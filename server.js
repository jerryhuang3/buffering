'use strict';
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const cookieSession = require('cookie-session');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Iniitalize express and routes
const app = express();
const home = require('./routes/home');
const login = require('./routes/login');
const logout = require('./routes/logout');
const signup = require('./routes/signup');
const connect = require('./routes/connect');
const goals = require('./routes/goals');
const initialize = require('./routes/initialize');
const demo = require('./routes/demo');
const extension = require('./routes/extension');

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
app.post('/', home);
app.post('/login', login);
app.post('/logout', logout);
app.post('/signup', signup);
app.post('/connect', connect);
app.post('/goals', goals.goal);
app.post('/goals/check', goals.check);
app.post('/goals/update', goals.update);
app.post('/initialize', initialize);
app.post('/extension', cors(), extension);
app.post('/demo', demo);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
