const auth = require('../helpers/auth');
const queries = require('../db/queries');
const moment = require('moment');

module.exports = home = async (req, res) => {
  console.log(req.session.user)
  // Looks up user info upon loading app
  if (req.session.user) {
    const user = await queries.getUserWithToken(req.session.user); // Works if user is connected to google
    console.log(user)
    // For users not connected to google
    if (!user) {
      console.log('user is not connected to google');
      const user = await queries.getUserById(req.session.user);
      return res.json({ name: user.name, access_token: null, image_url: user.image_url });
    }
    // For users connected to google
    // First check if access token is expired and generate a new one if it is
    if (moment(Date.now()).valueOf() >= user.expires_at + 3500000) {
      const newAccessToken = await auth.refreshAccessToken(user.refresh_token);
      await queries.setTokenExistingUser(req.session.user, newAccessToken.access_token, newAccessToken.expires_at);
      return res.json({ name: user.name, access_token: newAccessToken.access_token, image_url: user.image_url });
    }
    return res.json({ name: user.name, access_token: user.access_token, image_url: user.image_url });
  } else {
    return res.send(false);
  }
};
