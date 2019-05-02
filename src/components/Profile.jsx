import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment-es6';
import dataUtils from '../utils/data-utils';
//import progressChart from '../utils/progress-chart';

const steps = {
  method: 'POST',
  body: JSON.stringify({
    aggregateBy: [
      {
        dataTypeName: 'com.google.step_count.delta',
        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
      }
    ],

    bucketByTime: { durationMillis: 86400000 },
    startTimeMillis: 1554868800000,
    endTimeMillis: Date.now()
  }),
  headers: {
    token_type: "Bearer",
    'Content-Type': 'application/json;encoding=utf-8',
    Host: 'www.googleapis.com'
  }
};

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity: []
    }
  }

  async componentDidMount() {
    const stepsArray = await dataUtils.filterAndFetchSteps(this.props.data.access_token);
    const goalFetch = await fetch('/goals', {
      method: 'POST',
      headers: {
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
      body: JSON.stringify({ googleId: this.props.data.google_id })
    });
    const goalJSON = await goalFetch.json();
    console.log("STEPS: ", stepsArray);
    console.log("GOALS: ", goal.JSON);

    const testData = {
      goals: [3000, 3500, 3000, 4000, 4000, 4000, 5000],
      steps: [3748, 4789, 2674, 2489, 6738, 4837, 7682]
    }
    progressChart.graphStepData(stepsArray, testData.goals);
  }

  render() {
    if (!this.props.data.session) {
      return <Redirect to="/login" />;
    }
    const steps = this.state.activity.map(day => {
      return <p>{day}</p>;
    });
    return (
      <div>
        <canvas id="ProgressChart" width="200px" height="200px"></canvas>
      </div>
    );
  }
}

export default Profile;
