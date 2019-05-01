const Chart = require('chart.js');
const ctx = document.getElementById('myChart');

var mixedChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Today', 'Yesterday', '2 Days Ago', '3 Days Ago', '4 Days Ago', '5 Days Ago', '6 Days Ago'],
        datasets: [{
            label: 'Goals',
            data: [3000, 3500, 3000, 4000, 4000, 4000, 5000],
            backgroundColor: [
                'rgba(255, 102, 25, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(3, 2, 5, 0.9)',
                'rgba(0, 1, 2, 1)',
                'rgba(133, 102, 255, 0.2)',
                'rgba(153, 102, 25, 0.25)',
                'rgba(13, 102, 255, 0.2)'
            ]
        }, {
            label: 'Steps',
            type: 'line',
            data: [3748, 4789, 2674, 2489, 6738, 4837, 7682],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: true
        }]
    }
});