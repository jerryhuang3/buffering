const express = require('express');
const router = express.Router();
const cors = require('cors');
const queries = require("./db/queries");



// TEST ROUTES

router.get('/', cors(), (req, res) =>
  res.json({ message: "Hello From the Server!" })
);

router.get('/login', (req, res) => {
  console.log('getting a fetch from test login');

  // FIND GOOGLE_ID in req.params
  // queries.getUserToken(googleId);

  res.sendStatus(200);
});


router.post('/newlogin', function(req, res) {
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


router.post('/googlelogin', function(req, res) {
  console.log("testing a google user login");
  const {googleId, name, email, refreshToken} = req.body;
  console.log(googleId, name, email, refreshToken);

  queries.checkGoogleIdExists(googleId)
  .then( idExists => {
    if(!idExists){
      console.log("user was not found and that's fine");

      queries.insertUser(googleId, name, email)
      .then( () => { queries.setTokenNewUser(googleId, refreshToken); })
      // SEND GOOGLE_ID
      .then( () => { res.sendStatus(200); })

    } else {
      console.log("this user exists and that's fine");

      queries.setTokenExistingUser(googleId, refreshToken)
      // SEND GOOGLE ID
      .then( () => { res.sendStatus(200) })
    }
  })
  .catch( (err) => res.sendStatus(402));
});
// curl -X POST http://localhost:3000/test/googlelogin -H 'Content-Type: application/json' -d '{"googleId" : "382847383748293", "name": "user???", "email": "bullshitGmail", "refreshToken": "223432ss" }'

module.exports =router;