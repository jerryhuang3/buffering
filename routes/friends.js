const queries = require('../db/queries');

const addFriend = (req, res) => {
  const otherUser = req.body.id;
  queries.addFriend(req.session.user, otherUser);
  res.status(200).json({action: 'completed'});
};

const removeFriend = (req, res) => {
  const otherUser = req.body.id;
  queries.removeFriend(req.session.user, otherUser)
  res.status(200).json({action: 'completed'});
  res.status(200);
};

const acceptFriend = (req, res) => {
  const otherUser = req.body.id;
  queries.acceptFriend(req.session.user, otherUser);
  res.status(200).json({action: 'completed'});
};

const checkFriend = async (req, res) => {
  const otherUser = req.body.id;
  const checkStatus =
    req.session.user < otherUser
      ? await queries.checkFriendStatus(req.session.user, otherUser)
      : await queries.checkFriendStatus(otherUser, req.session.user);

  if (checkStatus[0]) {
    res.json(checkStatus[0]);
  } else {
    res.json(null);
  }
};

module.exports = { addFriend, removeFriend, acceptFriend, checkFriend };
