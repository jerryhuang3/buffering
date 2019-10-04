const queries = require('../db/queries');
const utils = require('../helpers/utils');
const moment = require('moment');

module.exports = leaderboard = async (req, res) => {
	const totalStepsAndPoints = await queries.getAllUsersTotalStepsAndPoints()

	const sortedData = utils.sortByPoints(totalStepsAndPoints); 

  res.json(sortedData);
};
