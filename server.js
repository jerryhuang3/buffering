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

app.route("login");

// routes
app.use("/login", (req, res) => {
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
      // const {google_id, name, email, refresh_token} = req.body;
      // console.log(google_id, name, email, refresh_token);
      const { google_id, name, email, refresh_token } = {
        google_id: Math.floor(parseInt(user.sub) / 10000000),
        name: user.name,
        email: user.email,
        refresh_token: "token"
      };
      console.log("User query is about to run....");
      queries.checkGoogleIdExists(google_id).then(idExists => {
        if (!idExists) {
          console.log("user was not found");

          queries.insertUser(google_id, name, email, refresh_token).then(() => {
            res.sendStatus(200);
          });
        } else {
          console.log("this user exists and that's fine");
          res.status(200).send({msg: 'this user exists and that\'s fine'})
        }
      });
    });
});

app.use('/token', (req, res) => {
console.log("/token ROUTE IS RUNNING");
res.status(200).send({msg: 'this user exists and that\'s fine'})

})

app.get('/testroute', (req, res) => {
  console.log('HI');
})

//test with
// curl -X POST http://localhost:3000/test/newlogin -H 'Content-Type: application/json' -d '{"googleId" : 15, "name": "curlName", "email": "bullshitGmail" }'

app.post("/test/googlelogin", function(req, res) {
  console.log("testing a google user login");
  const { googleId, name, email, refresh_token } = req.body;
  console.log(googleId, name, email, refresh_token);

  queries
    .checkGoogleIdExists(googleId)
    .then(idExists => {
      if (!idExists) {
        console.log("user was not found");

        queries.insertUser(googleId, name, email, refresh_token).then(() => {
          res.sendStatus(200);
        });
      } else {
        console.log("this user exists and that's fine");

        res.sendStatus(200);
      }
    })
    .catch(err => res.sendStatus(402));
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

// curl -X POST http://localhost:3000/test/googlelogin -H 'Content-Type: application/json' -d '{"googleId" : 150, "name": "user???", "email": "bullshitGmail", "token": "222sss" }'
