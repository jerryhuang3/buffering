const moment = require('moment');
const axios = require('axios');

const sortByPoints = data => {
  return data.sort((a, b) => (a.total < b.total ? 1 : -1));
};

function computeUserStatus(stepArray, goalArray) {
  let negativePoints = 0;
  for (let i = 0; i < goalArray.length; i++) {
    if (stepArray[i] < goalArray[i]) {
      negativePoints += 1;
    }
  }
  if (negativePoints === 0) {
    return { level: 'GOOD', color: 'green', shadow: '0 0 1px white' };
  } else if (negativePoints < 2) {
    return { level: 'BAD', color: 'yellow', shadow: '0 0 2px black' };
  } else if (negativePoints < 3) {
    return { level: 'AWFUL', color: 'red', shadow: '0 0 2px black' };
  } else {
    return { level: 'HELL', color: 'black', shadow: '0 0 2px white' };
  }
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
        .subtract(7, 'days')
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

  const config = {
    headers: {
      token_type: 'Bearer',
      'Content-Type': 'application/json;encoding=utf-8',
      Host: 'www.googleapis.com',
      Authorization: `Bearer ${accessToken}`
    }
  };
  return axios.post('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', request.body, config).catch(err => 'error');
}

async function filterAndFetchSteps(accessToken) {
  const dataAgg = await fetchStepData(accessToken);
  if (dataAgg === 'error') {
    return dataAgg;
  }

  let stepsTaken = [];
  //check for empty data
  for (let i = 0; i < dataAgg.data.bucket.length; i++) {
    if (dataAgg.data.bucket[i].dataset[0].point[0] !== undefined) {
      const stepVal = dataAgg.data.bucket[i].dataset[0].point[0].value[0].intVal;
      stepsTaken.push(stepVal);
    } else {
      stepsTaken.push(0);
    }
  }
 
  const stepsArray = stepsTaken.reverse()
  return stepsArray;
}

const weekArray = () => {
  const today = moment().endOf('day');
  const endOfDay = today.valueOf();

  let array = [endOfDay];

  for (let i = 1; i < 7; i++) {
    const ithDayAgo = today.subtract(1, 'days').valueOf();
    array.push(ithDayAgo);
  }
  return array;
};

module.exports = {
  computeUserStatus: computeUserStatus,
  orderGoals: orderGoals,
  getPastDaysIncludingToday: getPastDaysIncludingToday,
  filterAndFetchSteps: filterAndFetchSteps,
  sortByPoints: sortByPoints,
  weekArray: weekArray
};
