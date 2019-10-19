import ChartDataLabels from 'chartjs-plugin-datalabels';
const Chart = require('chart.js');

function goalRedOrGreen(goalValue, stepValue, idx) {
  if (goalValue === 0 || stepValue === 0) {
    return 'rgb(173,0,181, 0.5)';
  }
  const alpha = 0.3 + (0.5 * (idx + 1)) / 7;
  let redAmt = 173;
  let greenAmt = 0;
  let blueAmt = 181;

  if (goalValue > stepValue) {
    redAmt = 181;
    greenAmt = 0;
    blueAmt = 8;
  } else if (goalValue < stepValue) {
    redAmt = 8;
    greenAmt = 181;
    blueAmt = 0;
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
    plugin: [ChartDataLabels],
    data: {
      labels: ['6 days ago', '5 days ago', '4 days ago', '3 days ago', '2 days ago', 'yesterday', 'today'],
      datasets: [
        {
          label: 'Goals',
          data: goalArray,
          backgroundColor: colorArray,
          datalabels: {
            display: false
          }
        },
        {
          label: 'Steps',
          type: 'line',
          data: stepArray,
          backgroundColor: 'rgba(0, 181, 173, 1)',
          borderColor: 'rgba(0, 181, 173, 1)',
          fill: false,
          borderWidth: 4,
          datalabels: {
            color: '#fff',
            align: 'top',
            offset: 2,
            textShadowBlur: 15,
            textShadowColor: 'black',
            font: {
              size: 12
            }
          }
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Weekly Chart',
        fontSize: 20,
        fontColor: 'white',
        textShadowBlur: 15,
        textShadowColor: 'black'
      },
      legend: {
        labels: {
          fontSize: 15,
          fontColor: 'white',
          textShadowBlur: 15,
          textShadowColor: 'black'
        }
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontSize: 12,
              fontColor: 'white',
              beginAtZero: true,
              textShadowBlur: 15,
              textShadowColor: 'black'
            },
            gridLines: {
              color: '#B3EFFF'
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              fontSize: 12,
              fontColor: 'white',
              textShadowBlur: 15,
              textShadowColor: 'black'
            },
            gridLines: {
              color: '#B3EFFF'
            }
          }
        ]
      }
    }
  });
}

module.exports = {
  graphStepData: graphStepData
};
