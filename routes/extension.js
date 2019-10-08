const auth = require('../helpers/auth');
const queries = require('../db/queries');
const utils = require('../helpers/utils');
const moment = require('moment');

module.exports = extension = async (req, res) => {
  // if logged in send user-status else send false
  if (req.session.user) {
    const user = await queries.getUserWithToken(req.session.user);
    let currentAccessToken = user.access_token;

    // if token expired get then set new one
    if (moment(Date.now()).valueOf() >= user.expires_at + 3500000) {
      const newAccessToken = await auth.refreshAccessToken(user.refresh_token);
      await queries.setTokenExistingUser(user.id, newAccessToken.access_token, newAccessToken.expires_at);
      currentAccessToken = newAccessToken.access_token;
    }

    // init time constants
    const pastSevenDays = utils.getPastDaysIncludingToday(7);
    const today = pastSevenDays[0];
    const sevenDaysAgo = pastSevenDays[pastSevenDays.length - 1];
    // get goals from db -> order and null check
    const foundGoalsAwait = await queries.pastWeekGoals(user.id, sevenDaysAgo, today);
    const foundGoals = foundGoalsAwait[0];
    const goalHistory = utils.orderGoals(pastSevenDays, foundGoals);
    const goalReverse = goalHistory.reverse();
    // get steps using token
    const stepHistory = await utils.filterAndFetchSteps(currentAccessToken);
    const userStatus = utils.computeUserStatus(stepHistory, goalReverse);
    return res.json({ userStatus: userStatus });
  } else {
    return res.send(false);
  }
};
