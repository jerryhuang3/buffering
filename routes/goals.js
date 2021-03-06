const queries = require('../db/queries');
const moment = require('moment');

const goals = async function(req, res) {
  const id = req.session.user;
  // calculate rounded day and week ago from current time
  const today = moment().endOf('day');
  const endOfDay = today.valueOf();
  const weekAgo = moment()
    .endOf('day')
    .subtract(7, 'days')
    .valueOf();
  const foundGoalsAwait = await queries.pastWeekGoals(id, weekAgo, endOfDay);
  const foundGoals = foundGoalsAwait[0];
  let pastWeekArray = [endOfDay];
  for (let i = 1; i < 7; i++) {
    const ithDayAgo = today.subtract(1, 'days').valueOf();
    pastWeekArray.push(ithDayAgo);
  }
  const goalHistory = pastWeekArray.map(day => {
    const dayGoal = foundGoals.filter(goalObj => parseInt(goalObj.day_rounded) === day)[0]; // errors if no goals
    return dayGoal ? dayGoal.steps_goal : 0;
  });
  return res.json({ goalHistory: goalHistory });
};

const checkGoal = async (req, res) => {
  const goalExists = await queries.checkGoalExists(req.session.user);

  if (goalExists !== null) {
    return res.json(req.session.user);
  }
  return res.json(false);
};

const updateGoal = async function(req, res) {
  const id = req.session.user;
  const stepsGoal = req.body.steps;
  const endOfDay = moment()
    .endOf('day')
    .valueOf();
  // User can only update a goal once a day
  const canUpdate = await queries.canUserUpdateGoal(id);
  if (canUpdate) {
    queries.updateGoal(id, stepsGoal, endOfDay);
    return res.json(true);
  } else {
    return res.json(false);
  }
};

module.exports = { updateGoal, checkGoal, goals };
