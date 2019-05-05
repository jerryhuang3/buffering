import React, { Component } from 'react';
import dataUtils from '../utils/data-utils';
import Goal from './Goal.jsx';
import progressChart from '../utils/progress-chart';
import Connect from './Connect.jsx';


class Profile extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    console.log(this.props.data);
    if (!this.props.data.google_id) {
      console.log('umm u nid to knex to gogle plz');
    } else {
      const response = await fetch('/', { method: 'POST' });

      const accessData = await response.json();

      const stepsArray = await dataUtils.filterAndFetchSteps(accessData.access_token);
      const goalFetch = await fetch('/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: accessData.id })
      });
      const goalJSON = await goalFetch.json();
      console.log('STEPS: ', stepsArray);
      console.log('GOALS: ', goalJSON.goalHistory);

      progressChart.graphStepData(goalJSON.goalHistory.reverse(), stepsArray);
    }
  }

  render() {
    let connected;
    if (!this.props.data.google_id) {
      connected = <Connect profileData={this.props} />;
    } else {
      connected = <Goal profileData={this.props} />;
    }
    return (
      <div>
        {connected}
        <canvas id="ProgressChart" />
      </div>
    );
  }
}

export default Profile;
