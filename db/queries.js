// import knex
const env = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile')[env];
const knex = require('knex')(knexConfig);
const bcrypt = require('bcrypt');
const moment = require('moment');

function getUserId(email) {
  return Promise.all([
    knex('users')
      .where('email', email)
      .select()
  ]).then(result => {
    return result[0][0].id;
  });
}

function getUserById(id) {
  return Promise.all([
    knex('users')
      .where('users.id', id)
      .select()
  ]).then(result => {
    return result[0][0];
  });
}

function getUserByEmail(email) {
  return Promise.all([
    knex('users')
      .where('users.email', email)
      .select()
  ]).then(result => {
    return result[0][0];
  });
}

function getUserWithToken(id) {
  return Promise.all([
    knex('users')
      .join('tokens', { 'users.id': 'tokens.id' })
      .where('users.id', id)
      .select()
  ]).then(result => {
    return result[0][0];
  });
}

function checkEmail(email) {
  return Promise.all([
    knex('users')
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
    knex('users')
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

function checkGoogleIdExists(id) {
  return Promise.all([
    knex('users')
      .where({
        id: id
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
    knex('users').insert({
      google_id: googleId,
      name: name,
      email: email,
      password: password,
      image_url: imageUrl
    })
  ]);
}

function setTokenNewUser(id, accessToken, refreshToken, expiresAt) {
  return Promise.all([
    knex('tokens').insert({
      id: id,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt
    })
  ]);
}

function setTokenExistingUser(id, accessToken, expiresAt) {
  return Promise.all([
    knex('tokens')
      .where('id', '=', id)
      .update({
        access_token: accessToken,
        expires_at: expiresAt
      })
  ]);
}

function canUserUpdateGoal(id) {
  return Promise.all([
    knex('data')
      .join('users', { 'users.id': 'data.id' })
      .where('users.id', id)
      .orderBy('day_rounded', 'desc')
      .select('day_rounded', 'steps_goal')
      .limit(2)
  ]).then(result => {
    return result[0][0].steps_goal === result[0][1].steps_goal ? true : false;
  });
}

function initializeGoal(id, stepsGoal, endOfDay) {
  return Promise.all([
    knex('data').insert({
      id: id,
      steps_goal: stepsGoal,
      day_rounded: endOfDay
    })
  ]);
}

function checkGoalExists(id) {
  return Promise.all([
    knex('data')
      .where('id', id)
      .select()
  ]).then(result => {
    return result[0].length;
  });
}

function updateGoal(id, stepsGoal, endOfDay) {
  return Promise.all([
    knex('data')
      .where({ id: id, day_rounded: endOfDay })
      .update({
        steps_goal: stepsGoal
      })
  ]);
}

function insertGoal(id, stepsGoal, endOfDay) {
  return Promise.all([
    knex('data').insert({
      id: id,
      steps_goal: stepsGoal,
      day_rounded: endOfDay
    })
  ]);
}

// should be changed to periodGoals
function pastWeekData(id, weekAgo, endOfDay) {
  return Promise.all([
    knex('data')
      .where('id', '=', id)
      .whereBetween('day_rounded', [weekAgo, endOfDay])
      .select('steps_goal', 'daily_steps', 'day_rounded')
  ]);
}

// Keeps steps_goal the same from last recorded day to current day
function runningGoal(id) {
  return Promise.all([
    knex('data')
      .join('users', { 'users.id': 'data.id' })
      .where('users.id', id)
      .orderBy('day_rounded', 'desc')
      .select('data.id', 'day_rounded', 'steps_goal')
  ]).then(result => {
    if (!result[0][0]) {
      return;
    }
    const id = result[0][0].id;
    const stepsGoal = result[0][0].steps_goal;
    const lastEndOfDay = result[0][0].day_rounded;
    const currentEndOfDay = moment()
      .endOf('day')
      .valueOf();
    let numOfDays = (currentEndOfDay - lastEndOfDay) / 86400000;

    let day = parseInt(lastEndOfDay);
    for (let i = 0; i < numOfDays; i++) {
      day = day + 86400000;
      insertGoal(id, stepsGoal, day);
    }
  });
}

function connectGoogle(id, googleId) {
  return Promise.all([
    knex('users')
      .where('id', '=', id)
      .update({
        google_id: googleId
      })
  ]);
}

module.exports = {
  getUserId: getUserId,
  getUserById: getUserById,
  getUserByEmail: getUserByEmail,
  getUserWithToken: getUserWithToken,
  checkGoogleIdExists: checkGoogleIdExists,
  insertUser: insertUser,
  setTokenNewUser: setTokenNewUser,
  setTokenExistingUser: setTokenExistingUser,
  checkEmail: checkEmail,
  checkPassword: checkPassword,
  pastWeekData: pastWeekData,
  canUserUpdateGoal: canUserUpdateGoal,
  updateGoal: updateGoal,
  insertGoal: insertGoal,
  initializeGoal: initializeGoal,
  checkGoalExists: checkGoalExists,
  runningGoal: runningGoal,
  connectGoogle: connectGoogle
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
