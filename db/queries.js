// import knex
const env = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile')[env];
const knex = require('knex')(knexConfig);
const bcrypt = require('bcrypt');
const moment = require('moment');

function getUserInfo(userId) {
  return Promise.all([
    knex
      .select('users.id', 'name', 'total_steps', 'total', 'image_url')
      .from('users')
      .where('users.id', userId)
      .join(
        knex
          .select('data.id')
          .from('data')
          .sum('daily_steps as total_steps')
          .groupBy('data.id')
          .as('sum'),
        { 'users.id': 'sum.id' }
      )
      .join('points', { 'users.id': 'points.id' })
  ]).then(result => {
    return result[0];
  });
}

function getAllUsersTotalStepsAndPoints() {
  return Promise.all([
    knex
      .select('users.id', 'name', 'total_steps', 'total')
      .from('users')
      .join(
        knex
          .select('data.id')
          .from('data')
          .sum('daily_steps as total_steps')
          .groupBy('data.id')
          .as('sum'),
        { 'users.id': 'sum.id' }
      )
      .join('points', { 'users.id': 'points.id' })
  ]).then(result => {
    return result[0];
  });
}

function getUserFriends(userId) {
  return Promise.all([
    knex('relationships')
      .where('user_one_id', userId)
      .orWhere('user_two_id', userId)
      .andWhere('status', 1)
      .select()
  ]).then(result => {
    return result[0];
  });
}

function getUserFriendsBasicInfo(userId) {
  return Promise.all([
    knex('users')
      .where('id', userId)
      .select('id', 'name', 'image_url')
  ]).then(result => {
    return result[0][0];
  });
}

function getUserName(userId) {
  return Promise.all([
    knex('users')
      .where('id', userId)
      .select('name')
  ]).then(result => {
    return result[0][0];
  });
}

function checkFriendStatus(user_one_id, user_two_id) {
  return Promise.all([
    knex('relationships')
      .where('user_one_id', user_one_id)
      .andWhere('user_two_id', user_two_id)
      .select()
  ]).then(result => {
    return result[0];
  });
}

function addFriend(currentUser, otherUser) {
  return currentUser < otherUser
    ? Promise.all([
        knex('relationships').insert({
          user_one_id: currentUser,
          user_two_id: otherUser,
          status: 0,
          last_action_by: currentUser
        })
      ]).then(res => {
        return { success: true };
      })
    : Promise.all([
        knex('relationships').insert({
          user_one_id: otherUser,
          user_two_id: currentUser,
          status: 0,
          last_action_by: currentUser
        })
      ]).then(res => {
        return { success: true };
      });
}

function removeFriend(currentUser, otherUser) {
  return currentUser < otherUser
    ? Promise.all([
        knex('relationships')
          .where('user_one_id', currentUser)
          .andWhere('user_two_id', otherUser)
          .del()
      ])
    : Promise.all([
        knex('relationships')
          .where('user_one_id', otherUser)
          .andWhere('user_two_id', currentUser)
          .del()
      ]);
}

function acceptFriend(currentUser, otherUser) {
  return currentUser < otherUser
    ? Promise.all([
        knex('relationships')
          .where('user_one_id', currentUser)
          .andWhere('user_two_id', otherUser)
          .update({
            status: 1,
            last_action_by: currentUser
          })
      ])
    : Promise.all([
        knex('relationships')
          .where('user_one_id', otherUser)
          .andWhere('user_two_id', currentUser)
          .update({
            status: 1,
            last_action_by: currentUser
          })
      ]);
}

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
    if (result[0][0].google_id) {
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
  ]).then(res => {
    return { success: true };
  });
}

function initPoints(id) {
  return Promise.all([
    knex('points').insert({
      id: id,
      total: 0
    })
  ]).then(res => {
    return { success: true };
  });
}

function setTokenNewUser(id, accessToken, refreshToken, expiresAt) {
  return Promise.all([
    knex('tokens').insert({
      id: id,
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt
    })
  ]).then(res => {
    return { success: true };
  });
}

function setTokenExistingUser(id, accessToken, expiresAt) {
  return Promise.all([
    knex('tokens')
      .where('id', '=', id)
      .update({
        access_token: accessToken,
        expires_at: expiresAt
      })
  ]).then(res => {
    return { success: true };
  });
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

function checkGoalExists(id) {
  return Promise.all([
    knex('data')
      .where({ id: id })
      .select('steps_goal')
  ]).then(result => {
    return result[0][0].steps_goal;
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

function insertGoalAndSteps(id, stepsGoal, daily_steps, endOfDay) {
  return Promise.all([
    knex('data').insert({
      id: id,
      steps_goal: stepsGoal,
      daily_steps: daily_steps,
      day_rounded: endOfDay
    })
  ]);
}

function updateSteps(id, daily_steps, endOfDay) {
  return Promise.all([
    knex('data')
      .where({ id: id, day_rounded: endOfDay })
      .update({
        daily_steps: daily_steps
      })
  ]);
}

function insertSteps(id, daily_steps, endOfDay) {
  return Promise.all([
    knex('data').insert({
      id: id,
      daily_steps: daily_steps,
      day_rounded: endOfDay
    })
  ]).then(res => {
    return { success: true };
  });
}

//erroring out
function pastWeekData(id, weekAgo, endOfDay) {
  return Promise.all([
    knex('data')
      .where('id', '=', id)
      .whereBetween('day_rounded', [weekAgo, endOfDay])
      .orderBy('day_rounded', 'desc')
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
    console.log(numOfDays);
    let day = parseInt(lastEndOfDay);
    for (let i = 0; i < numOfDays; i++) {
      day = day + 86400000;
      insertGoal(id, stepsGoal, day);
    }
  });
}

function runningGoalAndSteps(id, stepsArray) {
  return Promise.all([
    knex('data')
      .join('users', { 'users.id': 'data.id' })
      .where('users.id', id)
      .orderBy('day_rounded', 'desc')
      .select('data.id', 'day_rounded', 'steps_goal', 'daily_steps')
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
    if (stepsArray) {
      const stepsToInsert = stepsArray.slice(0, numOfDays).reverse();
      for (let i = 0; i < numOfDays; i++) {
        day = day + 86400000;
        insertGoalAndSteps(id, stepsGoal, stepsToInsert[i], day);
      }
    } else {
      for (let i = 0; i < numOfDays; i++) {
        day = day + 86400000;
        insertGoalAndSteps(id, stepsGoal, 2000 + Math.floor(12000 * Math.random()), day);
      }
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
  getUserName: getUserName,
  getUserWithToken: getUserWithToken,
  getUserInfo: getUserInfo,
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
  updateSteps: updateSteps,
  insertSteps: insertSteps,
  initPoints: initPoints,
  checkGoalExists: checkGoalExists,
  runningGoal: runningGoal,
  runningGoalAndSteps: runningGoalAndSteps,
  connectGoogle: connectGoogle,
  getAllUsersTotalStepsAndPoints: getAllUsersTotalStepsAndPoints,
  getUserFriends: getUserFriends,
  getUserFriendsBasicInfo: getUserFriendsBasicInfo,
  addFriend: addFriend,
  removeFriend: removeFriend,
  acceptFriend: acceptFriend,
  checkFriendStatus: checkFriendStatus
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
