const Chart = require('chart.js');

const testData = {
  goals: [3000, 3500, 3000, 4000, 4000, 4000, 5000],
  steps: [3748, 4789, 2674, 2489, 6738, 4837, 7682]
};

function goalRedOrGreen(goalValue, stepValue, idx) {
  if (goalValue === 0 || stepValue === 0) {
    return 'rgba(100,100,100,0.5)';
  }

  const alpha = (0.5 * (idx + 1)) / 7;
  const redAmt = goalValue < stepValue ? 255 - parseInt(goalValue / stepValue) : 0;
  const greenAmt = goalValue > stepValue ? Math.max(255, 100 + (5 * stepValue) / goalValue) : 0;
  return `rgba(${redAmt}, ${greenAmt}, 1, ${alpha}`;
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
          backgroundColor: 'rgba(0, 181, 173, .5)',
          fill: true
        }
      ]
    },
    options: {
      scales: { yAxes: [{ ticks: { fontSize: 25 } }], xAxes: [{ ticks: { fontSize: 25 } }] }
    }
  });
  //return mixedChart
}

module.exports = {
  graphStepData: graphStepData
};
// graphStepData(testData.goals, testData.steps);
