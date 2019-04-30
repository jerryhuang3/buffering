require('dotenv').config();
// import knex
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig.development);

function testIsWorking () {
  return Promise.all([
    knex.select().from('users')
    ]);
}

function getUserProfile(username) {
  return Promise.all([
    knex('users')
    .where({
      username: username
    })
    .select()
  ]);
}

function checkGoogleIdExists(googleId) {
  return Promise.all([
    knex('google_users')
    .where({
      google_id: googleId
    })
    .select('google_id')
  ])
  .then( result => {
    if (result[0][0]) {
      return true
    } else {
      return false
    }
  });
}

function insertUser(googleId, name, email) {
  return Promise.all([
    knex('google_users').insert({
    google_id: googleId,
    name: name,
    email: email
    })
  ])
}

function setTokenNewUser(googleId, refreshToken) {
  return Promise.all([
    knex('tokens').insert({
      google_id: googleId,
      refresh_token: refreshToken
    })
  ])
}

function setTokenExistingUser(googleId, refreshToken) {
  return Promise.all([
    knex('tokens')
      .where('google_id', '=', googleId)
      .update({
        refresh_token: refreshToken
      })
  ])
}

function insertUserIfNotFound(googleId, name, email) {
  return checkGoogleIdExists(googleId).then( idExists => {
    if (!idExists) {
      return Promise.all([
        knex('google_users').insert({
        google_id: googleId,
        name: name,
        email: email
        // currency: currency
        })
      ])
    }
  })
}

function getUserToken(googleId) {
  return Promise.all([
    knex('tokens')
      .where({
        google_id: googleId
      })
      .select('refresh_token'_)
  ])
}



module.exports = {
  testIsWorking: testIsWorking,
  getUserProfile: getUserProfile,
  checkGoogleIdExists: checkGoogleIdExists,
  insertUserIfNotFound: insertUserIfNotFound,
  insertUser: insertUser,
  setTokenNewUser: setTokenNewUser,
  setTokenExistingUser: setTokenExistingUser,
  getUserToken: getUserToken
};

// DATABASE STRUCTURE
// ==================

// GOOGLE_USERS
// ------------
// google_id
// name
// email
// wallet_amount

// USER_GOALS
// ------------
// day
// steps_goal
// google_id

// TEMP_INFO
// -----------
// access_token
// current_status
// created_at
// updated_at
// google_id

// USERS
// -----------
// id --> auto-incrementing; dont set when adding new user
// username
// email
// password_digest
// wallet_amount
// token

// GOALS
// -----------
// day
// steps_goal
// user_id

// PROGRESS
// -----------
// day
// steps_walked
// user_id

// STANDING
// -----------
// day
// status  -> enum = standing_type ; can be one of [good, bad, awful, hell] (all lowercase!)
// user_id