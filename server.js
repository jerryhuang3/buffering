'use strict';

require('dotenv').config();

// import .env
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
// local session
const cookieSession = require('cookie-session');
// import express and related libraries
const express = require('express');
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
app.post('/', (req, res) => {
  console.log('GET / is RUNNING');
  console.log(req.session.userid);
  if (req.session.userid) {
    console.log('There are cookies so querying the database');
    queries
      .getUser(req.session.userid)
      .then(promise => {
        return promise;
      })
      .then(result => {
        console.log(result);
        res.json(result);
      });
  } else {
    console.log('No cookies so sending Hello');
    res.send(false);
  }
});

app.post('/login', (req, res) => {
  console.log('RECEIVING AUTHORIZATION CODE FROM CLIENT');
  const data = {
    code: req.body.code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    access_type: 'offline',
    grant_type: 'authorization_code'
  };

  // Requesting token information from google
  fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'post',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(json => {
      const user = jwt.decode(json.id_token);

      const { google_id, name, email, refresh_token } = {
        google_id: user.sub,
        name: user.name,
        email: user.email,
        refresh_token: user.refresh_token
      };

      req.session.userid = google_id;
      console.log('User query is about to run....');
      queries.checkGoogleIdExists(google_id).then(idExists => {
        if (!idExists) {
          console.log('user was not found');

          queries.insertUser(google_id, name, email).then(() => {
            queries.setTokenNewUser(google_id, refresh_token).then(() => {
              res.json({ name: user.name });
            });
          });
        } else {
          console.log("this user exists and that's fine");
          // queries.setTokenExistingUser(google_id, refresh_token).then(() => {
          res.json({ name: user.name });
        }
      });
    });
});

app.post('/logout', (req, res) => {
  console.log(req.session.userid)
  req.session = null;
  res.end()
})

app.get('/login/test_fetch', (req, res) => {
  // this works!
  console.log('main server login test');
});

// TEST
const testRoutes = require('./test_routes');
app.use('/tokentest', (req, res) => {
  console.log('/tokentest ROUTE IS RUNNING');
  const chatMessage = 'HELLO';
  return chatMessage;
});

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
  // queries.testIsWorking().then( result => console.log(result))
  // queries.checkGoogleIdExists(1).then(
  // result => console.log('google_id 1 exists:', result));
  // if you didn't make google_id=1 user, this should return false
});
