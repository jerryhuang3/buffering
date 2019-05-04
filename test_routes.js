const express = require("express");
const router = express.Router();
const cors = require("cors");
const queries = require("./db/queries");

// TEST ROUTES

router.get("/", cors(), (req, res) =>
  res.json({ message: "Hello From the Server!" })
);

router.post("/login", (req, res) => {
  console.log("getting a fetch from test login");
  
  const googleId = req.body.profileObj.googleId;
  const image = req.body.profileObj.imageUrl;
  const name = req.body.profileObj.name;
  const email = req.body.profileObj.email;
  const tokenObj = req.body.tokenObj;
  const refreshToken = req.body.refresh_token;
  const accessToken = req.body.tokenObj.access_token;
  const expiresAt = req.body.tokenObj.expires_at;

  // FIND GOOGLE_ID in req.params
  // queries.getUserToken(googleId);

  res.sendStatus(200);
});

router.post("/signup/google", (req, res) => {
  console.log("getting a fetch from test login");
  
console.log(req.body)

  // FIND GOOGLE_ID in req.params
  // queries.getUserToken(googleId);

  res.sendStatus(200);
});

router.post("/newlogin", function(req, res) {
  console.log("test route happening");
  const { googleId, name, email } = req.body;
  console.log(googleId, name, email);
  queries
    .insertUserIfNotFound(googleId, name, email)
    .then(() => console.log("finished inserting"))
    .then(() => res.sendStatus(200))
    .catch(err => res.sendStatus(402));
});
//test with
// curl -X POST http://localhost:3000/test/newlogin -H 'Content-Type: application/json' -d '{"googleId" : 15, "name": "curlName", "email": "bullshitGmail" }'

router.post("/googlelogin", function(req, res) {
  console.log("testing a google user login");
  const { googleId, name, email, refreshToken } = req.body;
  console.log(googleId, name, email, refreshToken);

  queries
    .checkGoogleIdExists(googleId)
    .then(idExists => {
      if (!idExists) {
        console.log("user was not found and that's fine");

        queries
          .insertUser(googleId, name, email)
          .then(() => {
            queries.setTokenNewUser(googleId, refreshToken);
          })
          // SEND GOOGLE_ID
          .then(() => {
            res.sendStatus(200);
          });
      } else {
        console.log("this user exists and that's fine");

        queries
          .setTokenExistingUser(googleId, refreshToken)
          // SEND GOOGLE ID
          .then(() => {
            res.sendStatus(200);
          });
      }
    })
    .catch(err => res.sendStatus(402));
});
// curl -X POST http://localhost:3000/test/googlelogin -H 'Content-Type: application/json' -d '{"googleId" : "382847383748293", "name": "user???", "email": "bullshitGmail", "refreshToken": "223432ss" }'

router.post("/auth", (req, res) => {
  queries.getUser("10753898229603");
});

module.exports = router;
