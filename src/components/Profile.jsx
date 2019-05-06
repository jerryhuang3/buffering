import React, { Component } from 'react';
import dataUtils from '../utils/data-utils';
import Goal from './Goal.jsx';
import { Grid, Divider, Card, Icon, Image } from 'semantic-ui-react';
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
    const userStatus = utils.computeUserStatus(stepHistory, goalHistory);

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
          <Grid.Row divided>
            <Grid.Column width={4}>
              <Card>
                <Image src="https://react.semantic-ui.com/images/avatar/large/daniel.jpg" wrapped ui={false} />
                <Card.Content>
                  <Card.Header>Daniel</Card.Header>
                  <Card.Meta>Joined in 2016</Card.Meta>
                  <Card.Description>Daniel is a comedian living in Nashville.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    10 Friends
                  </a>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={4}>
              <Goal profileData={this.props} />
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={12}>
              <canvas id="ProgressChart" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
    return <div>{connected}</div>;
  }
}

export default Profile;
