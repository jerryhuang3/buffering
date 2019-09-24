module.exports = logout = (req, res) => {
  req.session = null;
  return res.json(true);
};
