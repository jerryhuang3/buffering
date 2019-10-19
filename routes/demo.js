const status = require('../helpers/status-script');

module.exports = demo = (req, res) => {
  const id = req.session.user;
  switch (req.body.status) {
    case 'good':
      status.makeUsersGood(id).then(() => {
        return res.json('All users are now good');
      });
      break;
    case 'bad':
      status.makeUsersBad(id).then(() => {
        return res.json('All users are now bad');
      });
      break;
    case 'awful':
      status.makeUsersAwful(id).then(() => {
        return res.json('All users are now awful');
      });
      break;
    case 'hell':
      status.makeUsersHell(id).then(() => {
        return res.json('All users are now hell');
      });
      break;
    case 'mock':
      for (let i = 1; i <= 505; i++) {
        status.updateMock(i);
      }
      return res.json('Mock data updated');
  }
};
