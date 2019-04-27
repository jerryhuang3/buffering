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
    knex
  ])
}

module.exports = {
  testIsWorking: testIsWorking,
  getUserProfile: getUserProfile
}

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