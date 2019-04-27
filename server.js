<<<<<<< HEAD
const express = require('express');
const path = require('path'); 
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
=======
"use strict";
>>>>>>> 47c13c74997419383f35cd1c17a9052e6819f73b

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

// iniitalize express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'dist')));

// routes
app.post('/api/authenticate', function(req, res) {
  const username = req.body.username;
  queries.getUserProfile(username)
  .then( function(value) {
    if (value[0].length > 0) {
      console.log(value[0][0]);
      res.json(value[0][0]);
    } else {
      res.sendStatus(401);
    }
  })
  .catch( err => {
    console.log("error when getting user profile");
    console.error(err);
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