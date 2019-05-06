import React, { Component } from 'react';
import dataUtils from '../utils/data-utils';
import Goal from './Goal.jsx';
import { Grid } from 'semantic-ui-react';
import progressChart from '../utils/progress-chart';
import Connect from './Connect.jsx';

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const response = await fetch('/', { method: 'POST' });

    const accessData = await response.json();

    const stepsArray = await dataUtils.filterAndFetchSteps(accessData.access_token);
    console.log('steps array');
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

  connect = (name, bool, access) => {
    console.log(name, bool, access);
    this.props.connect(name, bool, access);
  };

  render() {
    let connected;
    if (!this.props.data.access_token) {
      connected = (
        <Grid centered>
          <Connect profileData={this.props} connect={this.connect} />
        </Grid>
      );
    } else {
      connected = (
        <Grid centered>
          <Grid.Column width={9}>
            <Goal profileData={this.props} />
          </Grid.Column>
          <canvas id="ProgressChart" />
        </Grid>
      );
    }
    return <div>{connected}</div>;
  }
}

export default Profile;
