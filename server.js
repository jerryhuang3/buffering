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

// iniitalize express
const app = express();
app.use('/', express.static(path.join(__dirname, 'dist')));



app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
    queries.testIsWorking().then( result => console.log(result))
    queries.getUserProfile("Good").then( result => console.log(result));
  }
);