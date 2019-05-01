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
  console.log("req.session.userid = ", req.session.userid);
  if (req.session.userid) {
    console.log('There are cookies so querying the database');
    queries
      .getUser(req.session.userid)
      .then(result => {
        console.log(result);
        res.json(result);
      });
  } else {
    console.log('No cookies so sending Hello');
    res.send(false);
  }
});


// ASYNC METHOD
app.post('/login', async function(req, res){
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

  req.session.userid = googleId; //set userid in cookie
  console.log('User query is about to run....');

  const idExists = await queries.checkGoogleIdExists(googleId);
  if (!idExists) {
    console.log('user was not found...so we can make one!');

    await queries.insertUser(googleId, name, email, refreshToken);
    await queries.setTokenNewUser(googleId, accessToken);
    await res.json({ name: user.name, access_token: accessToken });

  } else {
    console.log("this user exists and that's fine");
    await queries.setTokenExistingUser(googleId, accessToken);
    await res.json({ name: user.name, access_token: accessToken });
  }
});



app.post('/logout', (req, res) => {
  console.log("this is cookie session id: ", req.session.userid);
  req.session = null;
  res.end();
  // res.sendStatus(200);
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
