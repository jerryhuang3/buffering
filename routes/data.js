const queries = require('../db/queries');
const moment = require('moment');

module.exports = data = async (req, res) => {
  // const id = req.session.user;

  const id = req.params.userId;
  // calculate rounded day and week ago from current time
  const today = moment().endOf('day');
  const endOfDay = today.valueOf();
  const weekAgo = moment()
    .endOf('day')
    .subtract(7, 'days')
    .valueOf();

  const userData = await queries.pastWeekData(parseInt(id), weekAgo, endOfDay);

  const steps = userData[0].map(idx => idx.daily_steps).reverse();
  const goals = userData[0].map(idx => idx.steps_goal).reverse();

  return res.json([steps, goals]);
};
