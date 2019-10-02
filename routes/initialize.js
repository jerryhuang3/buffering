const queries = require('../db/queries');
const moment = require('moment');

module.exports = initialize = async (req, res) => {
  
  const id = req.session.user;
  const stepsGoal = req.body.steps;
  const today = moment().endOf('day');
  const endOfDay = today.valueOf();
  
  let pastWeekArray = [endOfDay];
  for (let i = 1; i < 7; i++) {
    const ithDayAgo = today.subtract(1, 'days').valueOf();
    pastWeekArray.push(ithDayAgo);
  }
 
  for (let k = 0; k < pastWeekArray.length; k++) {
    await queries.initializeGoal(id, stepsGoal, pastWeekArray[k]);
  }

  return res.json(true);
};
