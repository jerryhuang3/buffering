const express = require('express');
const router = express.Router();
const cors = require('cors');
const queries = require("./db/queries");



// TEST ROUTES

router.get('/', cors(), (req, res) =>
  res.json({ message: "Hello From the Server!" })
);


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
  const {googleId, name, email, token} = req.body;
  console.log(googleId, name, email, token);

  queries.checkGoogleIdExists(googleId)
  .then( idExists => {
    if(!idExists){
      console.log("user was not found and that's fine");

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
// curl -X POST http://localhost:3000/test/googlelogin -H 'Content-Type: application/json' -d '{"googleId" : 150, "name": "user???", "email": "bullshitGmail", "token": "222sss" }'

module.exports =router;