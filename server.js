"use strict";

require('dotenv').config();

// import .env
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";

// import express and related libraries
const express     = require("express");
const bodyParser  = require("body-parser");
//const sass        = require("node-sass-middleware");
const path        = require('path');
//import helpers
const queries     = require('./db/queries');
// for fetching refresh and access tokens
const fetch = require('node-fetch');
// decode jwt file from google;
const jwt = require('jsonwebtoken');

// iniitalize express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'dist')));

// routes
app.use('/login', function(req, res) {
  console.log("trying to get from client", req.body);

  const data = {
    code: req.body.code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.RED_URL,
    access_type: 'offline',
    grant_type: 'authorization_code'
  }
  console.log(data);
  fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  })
    .then(res => res.json())
    .then(json => {

      const user = jwt.decode(json.id_token);
      console.log(user);
    });

    
});

app.get('/users/:userId', function(req, res) {
    User.find(req.params.userId).then(function(user) {
      res.json({ user: user });
  });
});



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
    // queries.testIsWorking().then( result => console.log(result))
    // queries.getUserProfile("Good").then( result => console.log(result));
  }
);