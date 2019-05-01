const Chart = require('chart.js');

// const mixedChart = new Chart(ctx, {
//   type: 'bar',
//   data: {
//     labels: ['Today', 'Yesterday', '2 Days Ago', '3 Days Ago', '4 Days Ago', '5 Days Ago', '6 Days Ago'],
//     datasets: [{
//       label: 'Goals',
//       data: ,
//       backgroundColor: [
//         'rgba(255, 102, 25, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(3, 2, 5, 0.9)',
//         'rgba(0, 1, 2, 1)',
//         'rgba(133, 102, 255, 0.2)',
//         'rgba(153, 102, 25, 0.25)',
//         'hsla(240, 0.3, 0.1, 0.2)'
//         // 'rgba(13, 102, 255, 0.2)'
//       ]
//     },
//     {
//       label: 'Steps',
//       type: 'line',
//       data: ,
//       backgroundColor: 'rgba(153, 102, 255, 0.2)',
//       fill: true
//     }]
//   }
// });

const testData = {
  goals: [3000, 3500, 3000, 4000, 4000, 4000, 5000],
  steps: [3748, 4789, 2674, 2489, 6738, 4837, 7682]
}

function goalRedOrGreen(goalValue, stepValue, idx) {
  const alpha = 0.5 * (idx + 1) / 7;
  const redAmt = goalValue < stepValue ? 255 - parseInt(goalValue / stepValue) : 0;
  const greenAmt = goalValue > stepValue ? Math.max(255, 100 + 5 * stepValue/goalValue) : 0;
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
      labels: ['6 Days Ago', '5 Days Ago', '4 Days Ago', '3 Days Ago', '2 Days Ago', 'Yesterday', 'Today'],
      datasets: [{
        label: 'Goals',
        data: goalArray,
        backgroundColor: colorArray
      },
      {
        label: 'Steps',
        type: 'line',
        data: stepArray,
        backgroundColor: 'rgba(95, 95, 200, 0.8)',
        fill: true
      }]
    }
  });
  //return mixedChart
}

graphStepData(testData.goals, testData.steps);