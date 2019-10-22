const queries = require('../db/queries');
const utils = require('../helpers/utils');

module.exports = leaderboard = async (req, res) => {
  const totalStepsAndPoints = await queries.getAllUsersTotalStepsAndPoints();

  const sortedData = utils.sortByType(totalStepsAndPoints, 'total', 'desc');

  for (let i = 1; i <= sortedData.length; i++) {
    sortedData[i - 1]['rank'] = i;
  }

  res.json(sortedData);
};
