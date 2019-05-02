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
  console.log('req.session.user = ', req.session.user);
  if (req.session.user) {
    console.log('There are cookies so querying the database');
    queries.getUser(req.session.user).then(result => {
      console.log(result);
      return res.json(result);
    });
  } else {
    console.log('No cookies so sending');
    res.send(false);
  }
});

app.post('/signup', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);
  const emailExists = await queries.checkEmail(req.body.email);
    if (emailExists) {
      res.status(400).send("<h1>HTTP 400 - BAD REQUEST: E-MAIL ALREADY USED!</h1><p><a href=\"/signup\">Back to Signup</a></p>");
    } else {
      await queries.insertUser(null, name, email, password);
      req.session.user = email; //Set user in cookie
      res.redirect('/profile');
    }
});

app.post('/login', async (req, res) => {
  console.log('RECEIVING LOGIN DATA');
  const email = req.body.email;
  const password = req.body.password;
  const checkPassword = await queries.checkPassword(email, password);
  if (checkPassword) {
    req.session.user = email; //Set user in cookie
    res.redirect('/profile');
  } else {
    res.status(400).send("<h1>HTTP 400 - BAD REQUEST: E-MAIL OR PASSWORD INCORRECT!</h1><p><a href=\"/login\">Back to Login</a></p>");
  }
});

app.post('/login/google', async function(req, res) {
  console.log('RECEIVING AUTHORIZATION CODE FROM CLIENT');
  if (req.body.email);

  const data = {
    code: req.body.code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    access_type: 'offline',
    grant_type: 'authorization_code'
  };

  // Requesting token information from google
  const fetchRes = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'post',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  })

  //decode data and set constants
  const fetchJSON = await fetchRes.json();
  console.log(fetchJSON);

  const user = jwt.decode(fetchJSON.id_token);

  const googleId = user.sub;
  const name = user.name;
  const email = user.email;
  const accessToken = fetchJSON.access_token;
  const refreshToken = fetchJSON.refresh_token;

  console.log("refreshTOKEN (oooh boy, i hope i get it):", refreshToken);

  req.session.user = email; //set user in cookie
  console.log('User query is about to run....');

  const idExists = await queries.checkGoogleIdExists(googleId);
  if (!idExists) {
    console.log('user was not found...so we can make one!');

    await queries.insertUser(googleId, name, email);
    await queries.setTokenNewUser(googleId, accessToken, refreshToken);
    res.json({ name: user.name, access_token: accessToken });

  } else {
    console.log("this user exists and that's fine");
    await queries.setTokenExistingUser(googleId, accessToken);
    res.json({ name: user.name, access_token: accessToken });
  }
});

app.post('/logout', (req, res) => {
  console.log('logout route is working');
  req.session = null;
  res.end();
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
