import React, { Component } from 'react';
import dataUtils from '../utils/data-utils';
import Goal from './Goal.jsx';
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

    progressChart.graphStepData(goalJSON.goalHistory.reverse(), stepsArray);
  }

  render() {

    return (
      <div>
        <Goal profileData={this.props} />
        <canvas id="ProgressChart" />
      </div>
    );
  }
}

export default Profile;
