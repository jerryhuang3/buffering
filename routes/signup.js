const auth = require('../helpers/auth');
const queries = require('../db/queries');
const bcrypt = require('bcrypt');

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

  const emailExists = await queries.checkEmail(user.email);

  if (emailExists) {
    return res.json(false);
  }

  if (user.type === 'google') {
    // Google sign up
    await queries.insertUser(user.googleId, user.name, user.email, null, user.picture);
    const id = await queries.getUserId(user.email);
    req.session.user = id;
    await queries.setTokenNewUser(id, user.accessTok, user.refreshTok, user.accessTokExp);
    return res.json({ name: user.name, access_token: user.accessTok, picture: user.picture });
  } else if (user.type === 'signup') {
    // Web sign up
    await queries.insertUser(null, user.name, user.email, user.password, user.picture);
    const id = await queries.getUserId(user.email);
    req.session.user = id;
    return res.json({ name: user.name, access_token: null, picture: user.picture });
  }
};
