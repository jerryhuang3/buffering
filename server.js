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
// for generating refresh and access tokens
const {OAuth2Client} = require('google-auth-library');
const http = require('http');
const fetch = require('node-fetch');

// iniitalize express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'dist')));

app.route('login')

const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            // acquire the code from the querystring, and close the web server.
            const qs = new url.URL(req.url, 'http://localhost:3000')
              .searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            // Now that we have the code, use that to acquire tokens.
            const r = await oAuth2Client.getToken(code);
            // Make sure to set the credentials on the OAuth2 client.
            oAuth2Client.setCredentials(r.tokens);
            console.info('Tokens acquired.');
            resolve(oAuth2Client);
          }
        } catch (e) {
          reject(e);
        }
      })

// routes
app.use('/login', function(req, res) {
  console.log("trying to get from client", req.body);
  const code = req.body.code;
  const client = process.env.CLIENT_ID;
  const secret = process.env.CLIENT_SECRET;
  const uri = process.env.RED_URL;
  const url = `https://www.googleapis.com/oauth2/v4/token?code=${code}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&redirect_uri${process.env.RED_URI}&grant_type=authorizatoin_code`;
  // const getData = async url => {
  //   try {
  //     const response = await fetch(url);
  //     console.log(response);
  //     const json = await response.json();
  //     console.log(json);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const data = {
    code: code,
    client_id: client,
    client_secret: secret,
    redirect_uri: uri,
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
    .then(json => console.log(json));
  // queries.getUserProfile("Good")
  // .then( function(value) {
  //   if (value[0].length > 0) {
  //     console.log(value[0][0]);
  //     res.json(value[0][0]);
  //   } else {
  //     res.sendStatus(401);
  //   }
  // })
  // .catch( err => {
  //   console.log("error when getting user profile");
  //   console.error(err);
  // });
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