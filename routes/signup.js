const auth = require('../helpers/auth');
const queries = require('../db/queries');
const bcrypt = require('bcrypt');
const dataUtils = require('../src/utils/data-utils');
const utils = require('../helpers/utils');

module.exports = signup = async (req, res) => {
  const user = req.body.code
    ? await auth.googleAuth(req.body.code)
    : {
        type: 'signup',
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        picture: `https://avatars.dicebear.com/v2/avataaars/${req.body.name.replace(/ /g, '')}.svg`
      };

  // Check if user exists after creating the user object
  const emailExists = await queries.checkEmail(user.email);
  if (emailExists) {
    return res.json(false);
  }

  const pastWeekArray = utils.weekArray();
  if (user.type === 'google') {
    // Google sign up
    await queries.insertUser(user.googleId, user.name, user.email, null, user.picture);
    const [id, stepsArray] = await Promise.all([queries.getUserId(user.email), utils.filterAndFetchSteps(user.accessTok)]);

    req.session.user = id;

    await Promise.all([
      queries.setTokenNewUser(id, user.accessTok, user.refreshTok, user.accessTokExp),
      queries.initPoints(id),
      pastWeekArray.forEach((day, idx) => {
        queries.insertSteps(id, stepsArray[idx], day);
      })
    ]);

    return res.json({ id: id, name: user.name, access_token: user.accessTok, picture: user.picture });
  } else if (user.type === 'signup') {
    // Web sign up
    await queries.insertUser(null, user.name, user.email, user.password, user.picture);

    const id = await queries.getUserId(user.email);
    req.session.user = id;

    await Promise.all([queries.initPoints(id), pastWeekArray.forEach(day => queries.insertSteps(id, 0, day))]);

    return res.json({ id: id, name: user.name, access_token: null, picture: user.picture });
  }
};
