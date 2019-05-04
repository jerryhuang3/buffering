const Chart = require('chart.js');

const testData = {
  goals: [3000, 3500, 3000, 4000, 4000, 4000, 5000],
  steps: [3748, 4789, 2674, 2489, 6738, 4837, 7682]
};

function goalRedOrGreen(goalValue, stepValue, idx) {
  if (goalValue === 0 || stepValue === 0) {
    return 'rgb(173,0,181, 0.5)';
  }
  const alpha = 0.3 + (0.5 * (idx + 1)) / 7;
  let redAmt = 173;
  let greenAmt = 0;
  let blueAmt = 181;

  if (goalValue > stepValue) {
    redAmt = 0;
    greenAmt = 99;
    blueAmt = 181;
  }
  else if (goalValue < stepValue) {
    redAmt = 0;
    greenAmt = 181;
    blueAmt = 83;
  }

  return `rgba(${redAmt}, ${greenAmt}, ${blueAmt}, ${alpha}`;
}

function graphStepData(goalArray, stepArray) {
  let colorArray = [];
  for (let i = 0; i < 7; i++) {
    const newColor = goalRedOrGreen(goalArray[i], stepArray[i], i);
    colorArray.push(newColor);
  }
  const ctx = document.getElementById('ProgressChart');
  const mixedChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        '6 Days Ago',
        '5 Days Ago',
        '4 Days Ago',
        '3 Days Ago',
        '2 Days Ago',
        'Yesterday',
        'Today'
      ],
      datasets: [
        {
          label: 'Goals',
          data: goalArray,
          backgroundColor: colorArray
        },
        {
          label: 'Steps',
          type: 'line',
          data: stepArray,
          backgroundColor: 'rgba(0, 181, 173, 1)',
          borderColor: 'rgba(0, 181, 173, 1)',
          fill: false,
          borderWidth: 8
        }
      ]
    },
    options: {
      legend: {
        labels: {
          fontSize: 25,
          fontColor: 'white'
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontSize: 25,
            fontColor: 'white',
            beginAtZero: true }
          }],
        xAxes: [{
          ticks: {
            fontSize: 25,
            fontColor: 'white'
          }
        }]
      }
    }
  });
  //return mixedChart
}

module.exports = {
  graphStepData: graphStepData
};
// graphStepData(testData.goals, testData.steps);
