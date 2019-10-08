const auth = require('../helpers/auth');
const queries = require('../db/queries');
const utils = require('../helpers/utils');
const moment = require('moment');

module.exports = extension = async (req, res) => {
  // if logged in send user-status else send false
  if (req.session.user) {
    // init time constants
    const pastSevenDays = utils.getPastDaysIncludingToday(7);
    const today = pastSevenDays[0];
    const sevenDaysAgo = pastSevenDays[pastSevenDays.length - 1];

    // get goals from db -> order and null check
    const userData = await queries.pastWeekData(req.session.user, sevenDaysAgo, today);

    const stepsHistory = userData[0].map(idx => idx.daily_steps).reverse();
    const goalHistory = userData[0].map(idx => idx.steps_goal).reverse();

    const goalReverse = goalHistory.reverse();
    const stepReverse = stepsHistory.reverse();

    const userStatus = utils.computeUserStatus(stepReverse, goalReverse);
    return res.json({ userStatus: userStatus.level.toLowerCase() });
  } else {
    return res.send(false);
  }
};
