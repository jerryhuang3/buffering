import React, { Component } from 'react';
import dataUtils from '../utils/data-utils';
import utils from '../../utils.js';
import Goal from './Goal.jsx';
import { Grid, Divider, Card, Icon, Image, Progress, Statistic, Popup, Container } from 'semantic-ui-react';
import progressChart from '../utils/progress-chart';
import Connect from './Connect.jsx';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: null,
      week_progress: null,
      day_progress: null
    };
  }

  async componentDidMount() {
    const response = await fetch('/', { method: 'POST' });

    const accessData = await response.json();

    const stepsArray = await dataUtils.filterAndFetchSteps(accessData.access_token);

    const goalFetch = await fetch('/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: accessData.id })
    });

    const goalJSON = await goalFetch.json();
    const goalArray = goalJSON.goalHistory.reverse();
    let userStatus;
    if (stepsArray) {
      const pastThreeSteps = stepsArray.slice(4);
      const pastThreeGoals = goalArray.slice(4);
      userStatus = utils.computeUserStatus(pastThreeSteps, pastThreeGoals);
      this.weekProgress(stepsArray);
      this.dayProgress(stepsArray[6], goalArray[6]);
      this.status(userStatus);
    }

    progressChart.graphStepData(goalArray, stepsArray);
  }

  dayProgress = (steps, goal) => {
    if (steps / goal > 1) {
      this.setState({ day_progress: 100 });
    } else {
      this.setState({ day_progress: ((steps / goal) * 100).toFixed(2) });
    }
  };

  weekProgress = stepsArray => {
    let sumOfSteps = 0;
    for (let i = 0; i < stepsArray.length; i++) {
      sumOfSteps = sumOfSteps + stepsArray[i];
    }
    this.setState({ week_progress: sumOfSteps });
  };

  status = userStatus => {
    this.setState({ status: userStatus.toUpperCase() });
  };

  connect = (name, bool, access) => {
    this.props.connect(name, bool, access);
  };

  render() {
    let progress;
    if (this.state.day_progress === 100) {
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
                  <Card.Meta>Joined in 2019</Card.Meta>
                  <Card.Description>{this.props.data.name} is a web developer.</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    No Friends
                  </a>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={4} verticalAlign="middle">
              <Grid.Row divided style={{ textAlign: 'center' }}>
                <h3>Current tier of browsing:</h3>
                <h1>{this.state.status}</h1>
              </Grid.Row>
              <br />
              <br />
              <br />
              <Goal profileData={this.props} />
            </Grid.Column>
            <Grid.Column width={4} verticalAlign="middle">
              <Grid.Row divided style={{ textAlign: 'center' }}>
                <Statistic className="semantic">
                  <Statistic.Value className="semantic">{this.state.week_progress}</Statistic.Value>
                  <Statistic.Label className="slabel">Steps Taken This Week</Statistic.Label>
                </Statistic>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
          <Divider />
          <Grid.Row>
            <Grid.Column width={12}>
              <p className="progress">Today's Progress</p>
              <Progress percent={this.state.day_progress} indicating progress>
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
