require('dotenv').config();
// import knex
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.development);
const bcrypt = require('bcrypt');


function testIsWorking() {
  return Promise.all([knex.select().from('users')]);
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


function getUser(email) {
  return Promise.all([
    knex('google_users')
      .join('tokens', { 'google_users.google_id': 'tokens.google_id' })
      .where('google_users.email', email)
      .select()
  ]).then(result => {
    return result[0][0];
  });
}


function checkEmail(email) {
  return Promise.all([
    knex('google_users')
      .where({
        email: email
      })
      .select('password')
  ]).then(result => {
    if (result[0][0]) {
      return result[0][0];
    } else {
      return false;
    }
  });
}

function checkPassword(email, password) {
  return Promise.all([
    knex('google_users')
      .where({
        email: email
      })
      .select('password')
  ]).then(result => {
    if (result[0][0]) {
      return bcrypt.compareSync(password, result[0][0].password);
    } else {
      return false;
    }
  });
}


function checkGoogleIdExists(googleId) {
  return Promise.all([
    knex('google_users')
      .where({
        google_id: googleId
      })
      .select('google_id')
  ]).then(result => {
    if (result[0][0]) {
      return true;
    } else {
      return false;
    }
  });
}


function insertUser(googleId, name, email, password, imageUrl) {
  return Promise.all([
    knex('google_users').insert({
      google_id: googleId,
      name: name,
      email: email,
      password: password,
      image_url: imageUrl
    })
  ]);
}


function setTokenNewUser(googleId, accessToken, refreshToken, expiresAt) {
  return Promise.all([
    knex('tokens').insert({
      google_id: googleId,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt
    })
  ]);
}

function setTokenExistingUser(googleId, accessToken, expiresAt) {
  return Promise.all([
    knex('tokens')
      .where('google_id', '=', googleId)
      .update({
        access_token: accessToken,
        expires_at: expiresAt
      })
  ]);
}


function insertUserIfNotFound(googleId, name, email, password) {
  return checkGoogleIdExists(googleId).then(idExists => {
    if (!idExists) {
      return Promise.all([
        knex('google_users').insert({
          google_id: googleId,
          name: name,
          email: email,
          password: password
        })
      ]);
    }
  });
}


function checkGoalExists(googleId, endOfDay) {
  return Promise.all[(
    knex('goals')
    .where('google_id', '=', googleId)
    .where('day_rounded', '=', endOfDay)
    .select('day_rounded')
  )]
  .then( result => {
    result[0][0] ? true : false;
  })
}

function insertGoal(googleId, stepsGoal, endOfDay) {
  return Promise.all([
    knex('goals').insert({
      google_id: googleId,
      steps_goal: stepsGoal,
      day_rounded: endOfDay
    })
  ]);
}

function updateGoal(googleId, stepsGoal, endOfDay) {
  return Promise.all([
    knex('goals')
    .where('google_id', '=', googleId)
    .where('day_rounded', '=', endOfDay)
    .update({
      steps_goal: stepsGoal
    })
  ])
}

// should be changed to periodGoals
function pastWeekGoals(googleId, weekAgo, endOfDay) {
  return Promise.all([
    knex('goals')
    .where('google_id','=', googleId)
    .whereBetween('day_rounded', [weekAgo, endOfDay])
    .select('steps_goal', 'day_rounded')
  ])
}




module.exports = {
  testIsWorking: testIsWorking,
  getUserProfile: getUserProfile,
  getUser: getUser,
  checkGoogleIdExists: checkGoogleIdExists,
  insertUserIfNotFound: insertUserIfNotFound,
  insertUser: insertUser,
  setTokenNewUser: setTokenNewUser,
  setTokenExistingUser: setTokenExistingUser,
  checkEmail: checkEmail,
  checkPassword: checkPassword,
  pastWeekGoals: pastWeekGoals,
  updateGoal: updateGoal
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
