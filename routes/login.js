const auth = require('../helpers/auth');
const queries = require('../db/queries');
const bcrypt = require('bcrypt')

module.exports = login = async (req, res) => {
  console.log('login ROUTE', req.body);
  const user = req.body.code ? await auth.googleAuth(req.body.code) : { type: 'login', ...(await queries.getUserByEmail(req.body.email)) };

  console.log(user);

  // Check if user exists or email is correct
  if (!user) {
    return res.json(false);
  }

  // Check if user is logging in from google or not
  switch (user.type) {
    case 'google':
      // google login
      const userId = await queries.getUserId(user.email);
      console.log("USER ID", userId)
      queries.setTokenExistingUser(userId, user.accessTok, user.accessTokExp);
      req.session.user = userId;
      queries.runningGoal(req.session.user);
      return res.json({ name: user.name, access_token: user.accessTok, picture: user.picture });
    case 'login':
      // web login
      const checkPassword = bcrypt.compareSync(req.body.password, user.password);
      if (checkPassword) {
        req.session.user = user.id;
        queries.runningGoal(req.session.user);
        return res.json({ name: user.name, picture: user.image_url });
      }
      // incorrect password
      return res.json(false);
  }
};
