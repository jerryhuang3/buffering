import React, { Component } from 'react';
import dataUtils from '../utils/data-utils';
import progressChart from '../utils/progress-chart';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity: []
    };
  }

  async componentDidMount() {
    const response = await fetch('/', { method: 'POST' });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const accessData = await response.json();

    const stepsArray = await dataUtils.filterAndFetchSteps(accessData.access_token);
    const goalFetch = await fetch('/goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({ googleId: accessData.google_id })
    });
    const goalJSON = await goalFetch.json();
    console.log('STEPS: ', stepsArray);
    console.log('GOALS: ', goalJSON.goalHistory);

    const testData = {
      goals: [3000, 3500, 3000, 4000, 4000, 4000, 5000],
      steps: [3748, 4789, 2674, 2489, 6738, 4837, 7682]
    };
    progressChart.graphStepData(goalJSON.goalHistory, stepsArray);
  }

  render() {
    const steps = this.state.activity.map(day => {
      return <p>{day}</p>;
    });
    return (
      <div>
        <canvas id="ProgressChart" />
      </div>
    );
  }
}

export default Profile;
