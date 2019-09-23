import React, { useState, useEffect } from 'react';
import dataUtils from '../utils/data-utils';
import utils from '../../utils.js';
import Goal from './Goal.jsx';
import { Grid, Divider, Card, Icon, Image, Progress, Statistic, Popup, Container } from 'semantic-ui-react';
import progressChart from '../utils/progress-chart';
import Connect from './Connect.jsx';

const Profile = props => {
  const [dailySteps, setDailySteps] = useState(null);
  const [weeklySteps, setWeeklySteps] = useState(null);
  const [state, setState] = useState({ status: null });

  useEffect(() => {
    const fetchData = async () => {
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
        weekProgress(stepsArray);
        dayProgress(stepsArray[6], goalArray[6]);
        status(userStatus);
      }

      progressChart.graphStepData(goalArray, stepsArray);
    };
    fetchData();
  }, []);

  const dayProgress = (steps, goal) => {
    if (steps / goal > 1) {
      setDailySteps(100);
    } else {
      setDailySteps(((steps / goal) * 100).toFixed(2));
    }
  };

  const weekProgress = stepsArray => {
    let sumOfSteps = 0;
    for (let i = 0; i < stepsArray.length; i++) {
      sumOfSteps = sumOfSteps + stepsArray[i];
    }
    setWeeklySteps(sumOfSteps);
  };

  const status = userStatus => {
    setState({ status: userStatus.toUpperCase() });
  };

  const connect = (name, bool, access) => {
    props.connect(name, bool, access);
  };

  let progress;
  if (state.day_progress === 100) {
    progress = "Congratulations! You've reached your goal for today!";
  } else {
    progress = "You've still got more walking to do bud!";
  }
  let connected;
  if (!props.data.access_token) {
    connected = (
      <Grid centered>
        <Grid.Row>
          <Grid.Column>
            <Connect profileData={props} connect={connect} />
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
              <Image src={props.data.picture} wrapped ui={false} circular />
              <Card.Content>
                <Card.Header>{props.data.name}</Card.Header>
                <Card.Meta>Joined in 2019</Card.Meta>
                <Card.Description>{props.data.name} is a full stack web developer.</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <a>
                  <Icon name="money bill alternate" />
                  Points: 15
                </a>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={4} verticalAlign="middle">
            <Grid.Row divided style={{ textAlign: 'center' }}>
              <h3>Current tier of browsing:</h3>
              <h1>{state.status}</h1>
            </Grid.Row>
            <br />
            <br />
            <br />
            <Goal profileData={props} />
          </Grid.Column>
          <Grid.Column width={4} verticalAlign="middle">
            <Grid.Row divided style={{ textAlign: 'center' }}>
              <Statistic className="semantic">
                <Statistic.Value className="semantic">{weeklySteps}</Statistic.Value>
                <Statistic.Label className="slabel">Steps Taken This Week</Statistic.Label>
              </Statistic>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
        <Divider />
        <Grid.Row>
          <Grid.Column width={12}>
            <p className="progress">Today's Progress</p>
            <Progress percent={dailySteps} indicating progress>
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
};

export default Profile;
