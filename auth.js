
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const moment = require('moment');

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
  const fetchRes = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  });

  //decode data and set constants
  const fetchJSON = await fetchRes.json();

  const id = jwt.decode(fetchJSON.id_token);
  
  // Create user profile object to send to server
  const profile = { 
      type: 'google',
      googleId: id.sub,
      name: id.name,
      email: id.email,
      picture: id.picture,
      accessTok: fetchJSON.access_token,
      accessTokExp: moment(Date.now()).valueOf() + 3500000,
      refreshTok: fetchJSON.refresh_token
  }
  
  return profile;
}

module.exports = {
  googleAuth: googleAuth
};
