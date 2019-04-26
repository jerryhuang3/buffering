require('dotenv').config();
// import knex
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig.development);

function testIsWorking () {
  return Promise.all([
    knex.select().from('users')
    ]);
}

module.exports = {
  testIsWorking: testIsWorking
}

// DATABASE STRUCTURE
// ==================

// USERS
// -----------
// id
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