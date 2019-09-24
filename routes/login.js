const auth = require('../helpers/auth');
const queries = require('../db/queries');

module.exports = login = async (req, res) => {
  const user = req.body.code
    ? await auth.googleAuth(req.body.code)
    : {
        type: 'login',
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      };

  const userId = await queries.getUserId(user.email);

  // When user signs up with website, connects account to google, and tries to use google login
  if (!userId) {
    return res.redirect('/400/login');
  }

  // Check if user is logging in from google or not
  switch (user.type) {
    case 'google':
      // google login
      queries.setTokenExistingUser(userId.id, user.accessTok, user.accessTokExp);
      req.session.user = userId.id;
      queries.runningGoal(req.session.user);
      return res.json({ name: user.name, access_token: user.accessTok, picture: user.picture });
    case 'login':
      // web login
      const emailCheck = await queries.checkEmail(user.email);
      if (emailCheck) {
        if (emailCheck.password !== null) {
          const checkPassword = await queries.checkPassword(user.email, user.password);
          if (checkPassword) {
            req.session.user = userId.id; //Set user in cookie
            queries.runningGoal(req.session.user);
            return res.redirect('/');
          }
        }
        // incorrect password
        return res.redirect('/400/login');
      } else {
        // incorrect email
        return res.redirect('/400/login');
      }
  }
};
