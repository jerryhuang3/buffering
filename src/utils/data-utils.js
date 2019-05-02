import moment from 'moment-es6';

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
      startTimeMillis: moment(Date.now()).endOf('day').subtract(7, 'days').valueOf(),
      endTimeMillis: Date.now()
    }),
    headers: {
      token_type: "Bearer",
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

  console.log("DataAgg is: ", dataAgg);

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
  console.log(stepsTaken);

  return stepsTaken
}

module.exports = {
  filterAndFetchSteps: filterAndFetchSteps
}