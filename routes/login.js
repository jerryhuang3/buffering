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
      console.log(stepsArray);
      console.log(pastWeekArray);
      await Promise.all([queries.setTokenExistingUser(id, user.accessTok, user.accessTokExp), queries.runningGoalAndSteps(id, stepsArray)]);

      req.session.user = id;
      return res.json({ id: id, name: user.name, access_token: user.accessTok, picture: user.picture });
    case 'login':
      // web login
      const checkPassword = bcrypt.compareSync(req.body.password, user.password);
      if (checkPassword) {
        // check if user has google account connected
        const connectedToGoogle = await queries.checkGoogleIdExists(user.id);

        if (connectedToGoogle) {
          // get new tokens
          const userAuth = await queries.getUserWithToken(user.id);
          const newAccessToken = await auth.refreshAccessToken(userAuth.refresh_token);
          await queries.setTokenExistingUser(user.id, newAccessToken.access_token, newAccessToken.expires_at);

          // update steps to google fit data if connected
          const stepsArray = await utils.filterAndFetchSteps(userAuth.access_token);
          await Promise.all([queries.runningGoalAndSteps(user.id, stepsArray)]);
          req.session.user = user.id;
          return res.json({ id: user.id, name: user.name, access_token: newAccessToken.access_token, picture: user.image_url });
        } else {
          // keep a running goal with random step count
          queries.runningGoalAndSteps(user.id, null);
          req.session.user = user.id;
          return res.json({ id: user.id, name: user.name, access_token: null, picture: user.image_url });
        }
      }
      // incorrect password
      return res.json(false);
  }
};
