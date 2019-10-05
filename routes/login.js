const auth = require('../helpers/auth');
const queries = require('../db/queries');
const bcrypt = require('bcrypt');

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

  // Check if user is logging in from google or not
  switch (user.type) {
    case 'google':
      // google login
      const userId = await queries.getUserId(user.email);
      queries.setTokenExistingUser(userId, user.accessTok, user.accessTokExp);
      req.session.user = userId;
      queries.runningGoal(req.session.user);
      return res.json({ id: userId, name: user.name, access_token: user.accessTok, picture: user.picture });
    case 'login':
      // web login
      const checkPassword = bcrypt.compareSync(req.body.password, user.password);
      if (checkPassword) {
        req.session.user = user.id;
        queries.runningGoal(req.session.user);
        return res.json({ id: user.id, name: user.name, access_token: null, picture: user.image_url });
      }
      // incorrect password
      return res.json(false);
  }
};
