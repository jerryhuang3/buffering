const moment = require('moment');

function computeUserStatus(stepArray, goalArray) {
  const userStatusMap = ['good', 'bad', 'awful', 'hell'];
  let negativePoints = 0;
  for (let i = 0; i < goalArray.length; i++) {
    if (stepArray[i] < goalArray[i]) {
      negativePoints -= 1;
    }
  }
  return userStatusMap[negativePoints];
}

function orderGoals(timeArray, foundGoals) {
  return timeArray.map(day => {
    const dayGoal = foundGoals.filter(goalObj => parseInt(goalObj.day_rounded) === day)[0];
    return dayGoal ? dayGoal.steps_goal : 0;
  })
}

function getPastDaysIncludingToday(numberDays) {
  const today = moment(Date.now()).endOf('day');
  const endOfDay = today.valueOf();

  let pastDaysArray = [endOfDay];
  for (let i = 1; i < numberDays; i++){
    const ithDayAgo = today.subtract(1, 'days').valueOf();
    pastDaysArray.push(ithDayAgo);
  }

  return pastDaysArray;
}

module.exports = {
  computeUserStatus: computeUserStatus,
  orderGoals: orderGoals,
  getPastDaysIncludingToday: getPastDaysIncludingToday
};