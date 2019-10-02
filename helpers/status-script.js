require('dotenv').config();
// import knex
const env = process.env.NODE_ENV || 'development'; 
const knexConfig = require('../knexfile')[env];
const knex = require('knex')(knexConfig);
const moment = require('moment');

function makeUsersBad() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 15000 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 0 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 0 })
  ]);
}

function makeUsersAwful() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 15000 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 15000 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 0 })
  ]);
}

function makeUsersHell() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 15000 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 15000 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 15000 })
  ]);
}

function makeUsersGood() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 0 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 0 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 0 })
  ]);
}

module.exports = {
  makeUsersGood: makeUsersGood,
  makeUsersBad: makeUsersBad,
  makeUsersAwful: makeUsersAwful,
  makeUsersHell: makeUsersHell
}

