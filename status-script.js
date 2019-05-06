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
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 50000 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 0 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 0 })
  ]);
}

function makeUsersAwful() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 50000 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 50000 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 0 })
  ]);
}

function makeUsersHell() {
  const endOfToday = moment().endOf('day').valueOf();
  const endOfYesterday = moment().endOf('day').subtract(1, 'day').valueOf();
  const endOfBeforeYesterday = moment().endOf('day').subtract(2, 'day').valueOf();

  return Promise.all([
    knex('goals').where({ 'day_rounded': endOfToday }).update({ 'steps_goal': 50000 }),
    knex('goals').where({ 'day_rounded': endOfYesterday }).update({ 'steps_goal': 50000 }),
    knex('goals').where({ 'day_rounded': endOfBeforeYesterday }).update({ 'steps_goal': 50000 })
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


const status = process.argv[2].toLowerCase();

switch (status) {
  case 'good':
    makeUsersGood().then( () => {
      console.log("All users are now good");
      process.exit();
    });
  break;

  case 'bad':
    makeUsersBad().then( () => {
      console.log("All users are now bad");
      process.exit();
    });
  break;

  case 'awful':
    makeUsersAwful().then( () => {
      console.log("All users are now awful");
      process.exit();
    });
  break;

  case 'hell':
    makeUsersHell().then( () => {
      console.log("HELL");
      process.exit();
    });
  break;

  default:
    console.log("ERROR: incorrect script argument")
  break;
}




