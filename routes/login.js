const auth = require('../helpers/auth');
const queries = require('../db/queries');
const bcrypt = require('bcrypt');
const utils = require('../helpers/utils');

module.exports = login = async (req, res) => {
  const user = req.body.code ? await auth.googleAuth(req.body.code) : { type: 'login', ...(await queries.getUserByEmail(req.body.email)) };

  // Check if user exists from web login
  if (!user || !user.email) {
    return res.json(false);
  }

  // Check if user exists from Google Login
  let userExists = await queries.getUserByEmail(user.email);
  if (!userExists) {
    return res.json(false);
  }

  const pastWeekArray = utils.weekArray();

  // Check if user is logging in from google or not
  switch (user.type) {
    case 'google':
      // google login
      const [id, stepsArray] = await Promise.all([queries.getUserId(user.email), utils.filterAndFetchSteps(user.accessTok)]);

      await Promise.all([
        queries.setTokenExistingUser(id, user.accessTok, user.accessTokExp),
        queries.runningGoal(id),
        pastWeekArray.forEach((day, idx) => {
          queries.updateSteps(id, stepsArray[idx], day);
        })
      ]);

      req.session.user = id;
      return res.json({ id: id, name: user.name, access_token: user.accessTok, picture: user.picture });
    case 'login':
      // web login
      const checkPassword = bcrypt.compareSync(req.body.password, user.password);
      if (checkPassword) {
        // check if user has google account connected
        const [connectedToGoogle] = await queries.checkGoogleIdExists(user.id);

        if (connectedToGoogle) {
          // udpate steps to google fit data if connected
          const [stepsArray] = await utils.filterAndFetchSteps(user.accessTok);
          await Promise.all([
            queries.runningGoal(user.id),
            pastWeekArray.forEach((day, idx) => {
              queries.updateSteps(user.id, stepsArray[idx], day);
            })
          ]);
        } else {
          // keep a running goal with step count of 0
          queries.runningGoalAndSteps(user.id);
        }
        req.session.user = user.id;
        return res.json({ id: user.id, name: user.name, access_token: null, picture: user.image_url });
      }
      // incorrect password
      return res.json(false);
  }
};
