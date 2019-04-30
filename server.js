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
// for generating refresh and access tokens
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");

// iniitalize express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "dist")));

//app.route("login");

// routes
app.post("/login", (req, res) => {
  console.log("RECEIVING AUTHORIZATION CODE FROM CLIENT");
  const data = {
    code: req.body.code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    access_type: "offline",
    grant_type: "authorization_code"
  };
  console.log(data);

  // Requesting token information from google
  fetch("https://www.googleapis.com/oauth2/v4/token", {
    method: "post",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(json => {
      const user = jwt.decode(json.id_token);
      console.log(user);
      // const {google_id, name, email, refresh_token} = req.body;
      // console.log(google_id, name, email, refresh_token);
      const { google_id, name, email, refresh_token } = {
        google_id: user.sub,
        name: user.name,
        email: user.email,
        refresh_token: "token"
      };
      console.log("User query is about to run....");
      queries.checkGoogleIdExists(google_id).then(idExists => {
        if (!idExists) {
          console.log("user was not found");

          queries.insertUser(google_id, name, email)
          .then( () => {
            queries.setTokenNewUser(google_id, refresh_token);
          })
          .then(() => {
            res.sendStatus(200);
          });
        } else {
          console.log("this user exists and that's fine");
          queries.setTokenExistingUser(google_id, refresh_token)
          .then ( () => {
            res.status(200).send({msg: 'this user exists and that\'s fine'})
          })
        }
      });
    });
});

app.get('/login/test_fetch', (req,res) => {
  // this works!
  console.log('main server login test');
})

// TEST
const testRoutes = require('./test_routes');
app.use('/test', testRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
  // queries.testIsWorking().then( result => console.log(result))
  // queries.checkGoogleIdExists(1).then(
    // result => console.log('google_id 1 exists:', result));
    // if you didn't make google_id=1 user, this should return false
});
