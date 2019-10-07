const auth = require('../helpers/auth');
const queries = require('../db/queries');
const utils = require('../helpers/utils');

module.exports = connect = async (req, res) => {
  const user = await auth.googleAuth(req.body.code);
  const id = req.session.user;

  const [stepsArray, pastWeekArray] = await Promise.all([utils.filterAndFetchSteps(user.accessTok), utils.weekArray()]);

  await Promise.all([
    pastWeekArray.forEach((day, idx) => {
      queries.updateSteps(id, stepsArray[idx], day);
    }),
    queries.connectGoogle(id, user.googleId),
    queries.setTokenNewUser(id, user.accessTok, user.refreshTok, user.accessTokExp)
  ]);

  return res.json({ name: user.name, access_token: user.accessTok, picture: user.picture });
};
