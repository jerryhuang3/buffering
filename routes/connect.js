const auth = require('../helpers/auth');
const queries = require('../db/queries');

module.exports = connect = async (req, res) => {
  const user = await auth.googleAuth(req.body.code);
  // Adding google info to existing account
  await queries.connectGoogle(req.session.user, user.googleId);
  await queries.setTokenNewUser(req.session.user, user.accessTok, user.refreshTok, user.accessTokExp);
  return res.json({ name: user.name, access_token: user.accessTok, picture: user.picture });
};
