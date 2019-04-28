"use strict";

require("dotenv").config();

// import .env
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";

// import express and related libraries
const express = require("express");
const bodyParser = require("body-parser");
//const sass        = require("node-sass-middleware");
const path = require("path");
//allow cross origin resource sharing
const cors = require("cors");
//import helpers
const queries = require("./db/queries");

// iniitalize express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "dist")));

// routes
app.post("/api/authenticate", function(req, res) {
  const username = req.body.username;
  queries
    .getUserProfile(username)
    .then(function(value) {
      if (value[0].length > 0) {
        console.log(value[0][0]);
        res.json(value[0][0]);
      } else {
        res.sendStatus(401);
      }
    })
    .catch(err => {
      console.log("error when getting user profile");
      console.error(err);
    });
});



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
  queries.testIsWorking().then( result => console.log(result))
  queries.checkGoogleIdExists(1).then(
    result => console.log('google_id 1 exists:', result));
    // if you didn't make google_id=1 user, this should return false
});



// TEST ROUTES
app.get("/test", cors(), (req, res) =>
  res.json({ message: "Hello From the Server!" })
);

app.post('/test/newlogin', function(req, res) {
  console.log("test route happening");
  const {googleId, name, email} = req.body;
  console.log(googleId, name, email);
  queries.insertUserIfNotFound(googleId, name, email)
    .then( () => console.log("finished inserting") )
    .then( () => res.sendStatus(200) )
    .catch( (err) => res.sendStatus(402));
});

//test with
// curl -X POST http://localhost:3000/test/newlogin -H 'Content-Type: application/json' -d '{"googleId" : 15, "name": "curlName", "email": "bullshitGmail" }'

app.post('/test/googlelogin', function(req, res) {
  console.log("testing a google user login");
  const {googleId, name, email, token} = req.body;
  console.log(googleId, name, email, token);

  queries.checkGoogleIdExists(googleId)
  .then( idExists => {
    if(!idExists){
      console.log("user was not found");

      queries.insertUser(googleId, name, email)
      .then( () => { queries.setTokenNewUser(googleId, token); })
      .then( () => { res.sendStatus(200); })

    } else {
      console.log("this user exists and that's fine");

      queries.setTokenExistingUser(googleId, token)
      .then( () => { res.sendStatus(200) })
    }
  })
  .catch( (err) => res.sendStatus(402));
});

// curl -X POST http://localhost:3000/test/googlelogin -H 'Content-Type: application/json' -d '{"googleId" : 15, "name": "curlName", "email": "bullshitGmail", "token": "s7f8ehfe8s883u8" }'
