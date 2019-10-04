const moment = require('moment');
const fetch = require('node-fetch');

const sortByPoints = (data) => {
  return data.sort((a, b) => (a.total < b.total) ? 1 : -1)
}

function computeUserStatus(stepArray, goalArray) {
  const userStatusMap = ['good', 'bad', 'awful', 'hell'];
  let negativePoints = 0;
  for (let i = 0; i < goalArray.length; i++) {
    if (stepArray[i] < goalArray[i]) {
      negativePoints += 1;
    }
  }
  return userStatusMap[negativePoints];
}

function orderGoals(timeArray, foundGoals) {
  return timeArray.map(day => {
    const dayGoal = foundGoals.filter(goalObj => parseInt(goalObj.day_rounded) === day)[0];
    return dayGoal ? dayGoal.steps_goal : 0;
  });
}

function getPastDaysIncludingToday(numberDays) {
  const today = moment(Date.now()).endOf('day');
  const endOfDay = today.valueOf();

  let pastDaysArray = [endOfDay];
  for (let i = 1; i < numberDays; i++) {
    const ithDayAgo = today.subtract(1, 'days').valueOf();
    pastDaysArray.push(ithDayAgo);
  }

  return pastDaysArray;
}

function fetchStepData(accessToken) {
  // Chrome Extension fetch
  const request = {
    method: 'POST',
    body: JSON.stringify({
      aggregateBy: [
        {
          dataTypeName: 'com.google.step_count.delta',
          dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
        }
      ],

      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: moment()
        .endOf('day')
        .subtract(3, 'days')
        .valueOf(),
      endTimeMillis: moment().valueOf()
    }),
    headers: {
      token_type: 'Bearer',
      'Content-Type': 'application/json;encoding=utf-8',
      Host: 'www.googleapis.com',
      Authorization: `Bearer ${accessToken}`
    }
  };
  return fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', request);
}

async function filterAndFetchSteps(accessToken) {
  const fetchResponse = await fetchStepData(accessToken);
  const dataAgg = await fetchResponse.json();

  let stepsTaken = [];
  //check for empty data
  for (let i = 0; i < dataAgg.bucket.length; i++) {
    if (dataAgg.bucket[i].dataset[0].point[0] !== undefined) {
      const stepVal = dataAgg.bucket[i].dataset[0].point[0].value[0].intVal;
      stepsTaken.push(stepVal);
    } else {
      stepsTaken.push(0);
    }
  }
  return stepsTaken;
}

module.exports = {
  computeUserStatus: computeUserStatus,
  orderGoals: orderGoals,
  getPastDaysIncludingToday: getPastDaysIncludingToday,
  filterAndFetchSteps: filterAndFetchSteps,
  sortByPoints: sortByPoints
};
