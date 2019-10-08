const queries = require('../db/queries');
const utils = require('../helpers/utils');

module.exports = initialize = async (req, res) => {
  const id = req.session.user;
  const stepsGoal = req.body.steps;
  const pastWeekArray = utils.weekArray();
  await Promise.all([
    pastWeekArray.forEach(day => {
      queries.updateGoal(id, stepsGoal, day);
    })
  ]);

  return res.json(id);
};
