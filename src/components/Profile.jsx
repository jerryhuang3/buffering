import React, { Component } from 'react';
import dataUtils from '../utils/data-utils';
import utils from '../../utils.js';
import Goal from './Goal.jsx';
import { Grid, Divider, Card, Icon, Image, Progress } from 'semantic-ui-react';
import progressChart from '../utils/progress-chart';
import Connect from './Connect.jsx';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: null,
      progress: null
    };
  }

  async componentDidMount() {
    const response = await fetch('/', { method: 'POST' });

    const accessData = await response.json();

    const stepsArray = await dataUtils.filterAndFetchSteps(accessData.access_token);
    console.log('steps array')
  
    const goalFetch = await fetch('/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: accessData.id })
    })


    const goalJSON = await goalFetch.json();
    const goalArray = goalJSON.goalHistory.reverse();

    const pastThreeSteps = stepsArray.slice(4);
    const pastThreeGoals = goalArray.slice(4);

    const userStatus = utils.computeUserStatus(pastThreeSteps, pastThreeGoals);

    this.dayProgress(stepsArray[6], goalArray[6]);
    progressChart.graphStepData(goalArray, stepsArray);
    this.setState({ status: userStatus });
  }

  dayProgress = (steps, goal) => {
    if (steps / goal > 1) {
      this.setState({ progress: 100 });
    } else {
      this.setState({ progress: ((steps / goal) * 100).toFixed(2) });
    }
  };

  connect = (name, bool, access) => {
    console.log(name, bool, access);
    this.props.connect(name, bool, access);
  };

  render() {
    let progress;
    if (this.state.progress === 100) {
      progress = "Congratulations! You've reached your goal for today!";
    } else {
      progress = "You've still got more walking to do bud!";
    }
    let connected;
    if (!this.props.data.access_token) {
      connected = (
        <Grid centered>
          <Grid.Row>
            <Grid.Column>
              <Connect profileData={this.props} connect={this.connect} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else {
      connected = (
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={4}>
              <Card>
                <Image src={this.props.data.picture} wrapped ui={false} circular />
                <Card.Content>
                  <Card.Header>{this.props.data.name}</Card.Header>
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
            <Grid.Column width={4} verticalAlign="middle">
              <Grid.Row divided style={{ textAlign: 'center' }}>
                <h3>Your current tier of browsing is:</h3>
                <h1>{this.state.status}</h1>
              </Grid.Row>
              <br />
              <br />
              <br />
              <Goal profileData={this.props} />
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={12}>
              <p className="progress">Today's Progress</p>
              <Progress percent={this.state.progress} indicating progress>
                {progress}
              </Progress>
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
