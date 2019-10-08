const jwt = require('jsonwebtoken');
const moment = require('moment');
const axios = require('axios');

async function googleAuth(authCode) {
  const body = {
    code: authCode,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    access_type: 'offline',
    grant_type: 'authorization_code'
  };

  // Requesting token information from google
  const fetchRes = await axios.post('https://www.googleapis.com/oauth2/v4/token', body);
  // Decode data and set constants
  const id = jwt.decode(fetchRes.data.id_token);
  // Create user profile object to send to server
  const profile = {
    type: 'google',
    googleId: id.sub,
    name: id.name,
    email: id.email,
    picture: `https://avatars.dicebear.com/v2/avataaars/${id.name.replace(/ /g, '')}.svg`,
    accessTok: fetchRes.data.access_token,
    accessTokExp: moment(Date.now()).valueOf() + 3500000,
    refreshTok: fetchRes.data.refresh_token
  };
  return profile;
}

async function refreshAccessToken(refreshToken) {
  const body = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  };

  const res = await axios.post('https://www.googleapis.com/oauth2/v4/token', body);

  // Decode data and set constants
  const newToken = {
    access_token: res.data.access_token,
    expires_at: moment(Date.now()).valueOf() + 3500000
  };

  return newToken;
}

module.exports = {
  googleAuth: googleAuth,
  refreshAccessToken: refreshAccessToken
};
