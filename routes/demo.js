const status = require('../helpers/status-script');

module.exports = demo = (req, res) => {
  switch (req.body.status) {
    case 'good':
      status.makeUsersGood().then(() => {
        return res.json('All users are now good');
      });
      break;
    case 'bad':
      status.makeUsersBad().then(() => {
        return res.json('All users are now bad');
      });
      break;
    case 'awful':
      status.makeUsersAwful().then(() => {
        return res.json('All users are now awful');
      });
      break;
    case 'hell':
      status.makeUsersHell().then(() => {
        return res.json('All users are now hell');
      });
      break;
  }
};
