require('dotenv').config();
// import knex
const env = process.env.NODE_ENV || 'development';
const knexConfig = require('../knexfile')[env];
const knex = require('knex')(knexConfig);
const utils = require('./utils');
const moment = require('moment');

const pastWeekArray = utils.weekArray();

function insertGoalAndStepsMock(id, stepsGoal, daily_steps, endOfDay) {
  return Promise.all([
    knex('data').insert({
      id: id,
      steps_goal: stepsGoal,
      daily_steps: daily_steps,
      day_rounded: endOfDay
    })
  ]);
}

async function makeUsersBad(id) {
  const stepsArray = [3722, 6844, 7372, 5849, 9722, 12212, 5210];
  return await pastWeekArray.forEach((day, idx) => {
    return Promise.all([
      knex('data')
        .where({ id: id, day_rounded: day })
        .update({ steps_goal: 5000, daily_steps: stepsArray[idx] })
    ]);
  });
}

async function makeUsersAwful(id) {
  const stepsArray = [4722, 4844, 7372, 5849, 9722, 12212, 5210];
  return await pastWeekArray.forEach((day, idx) => {
    return Promise.all([
      knex('data')
        .where({ id: id, day_rounded: day })
        .update({ steps_goal: 5000, daily_steps: stepsArray[idx] })
    ]);
  });
}

async function makeUsersHell(id) {
  const stepsArray = [4722, 4999, 2372, 5849, 9722, 12212, 5210];
  return await pastWeekArray.forEach((day, idx) => {
    return Promise.all([
      knex('data')
        .where({ id: id, day_rounded: day })
        .update({ steps_goal: 5000, daily_steps: stepsArray[idx] })
    ]);
  });
}

async function makeUsersGood(id) {
  const stepsArray = [7722, 8844, 7372, 5849, 9722, 12212, 5210];
  return await pastWeekArray.forEach((day, idx) => {
    return Promise.all([
      knex('data')
        .where({ id: id, day_rounded: day })
        .update({ steps_goal: 5000, daily_steps: stepsArray[idx] })
    ]);
  });
}

function updateMock(i) {
  return Promise.all([
    knex('data')
      .join('users', { 'users.id': 'data.id' })
      .where('users.id', i)
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
    for (let j = 0; j < numOfDays; j++) {
      day = day + 86400000;
      insertGoalAndStepsMock(id, stepsGoal, 2000 + Math.floor(12000 * Math.random()), day);
    }
  });
}

module.exports = {
  makeUsersGood: makeUsersGood,
  makeUsersBad: makeUsersBad,
  makeUsersAwful: makeUsersAwful,
  makeUsersHell: makeUsersHell,
  updateMock: updateMock
};
