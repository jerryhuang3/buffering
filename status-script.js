require('dotenv').config();
// import knex
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);
const moment = require('moment');

function makeUsersBad() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 15000 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 1000 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 1000 })
  ]);
}

function makeUsersAwful() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 12000 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 12000 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 1000 })
  ]);
}

function makeUsersHell() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 12000 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 12000 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 12000 })
  ]);
}

function makeUsersGood() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 0 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 1000 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 1000 })
  ]);
}

module.exports = {
  makeUsersGood: makeUsersGood,
  makeUsersBad: makeUsersBad,
  makeUsersAwful: makeUsersAwful,
  makeUsersHell: makeUsersHell
}


