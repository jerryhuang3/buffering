import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import dataUtils from '../utils/data-utils';
import utils from '../../helpers/utils.js';
import Goal from './Goal.js';
import { Divider, Card, Image, Progress, Statistic } from 'semantic-ui-react';
import progressChart from '../utils/progress-chart';
import Connect from './Connect.js';
import StateContext from './StateContext';

const Profile = () => {
  const [dailySteps, setDailySteps] = useState(null);
  const [weeklySteps, setWeeklySteps] = useState(null);
  const [currentStatus, setStatus] = useState(null);

  const context = useContext(StateContext);

  useEffect(() => {
    const getUser = async () => {
      const response = await fetch('/users', { method: 'POST' });
      const user = await response.json();
      context.setAccessToken(user.access_token);
      context.setPicture(user.image_url);
    };
    getUser();
    // if (context.access_token) { //temp change for fake user data
    createChart(context.access_token);
    // }
  }, Object.values(context));

  const createChart = async access_token => {
    // let stepsArray = await dataUtils.filterAndFetchSteps(access_token); // for google data

    const dataFetch = await fetch('/user/2/data', { method: 'POST' });
    const data = await dataFetch.json();
    const [stepsArray, goalArray] = [data[0], data[1]];
    let userStatus;
    console.log(stepsArray);
    console.log(goalArray);
    if (!stepsArray) {
      stepsArray = [0, 0, 0, 0, 0, 0, 0];
    }

    const pastThreeSteps = stepsArray.slice(4);
    const pastThreeGoals = goalArray.slice(4);
    userStatus = utils.computeUserStatus(pastThreeSteps, pastThreeGoals);
    weekProgress(stepsArray);
    dayProgress(stepsArray[6], goalArray[6]);
    setStatus(userStatus.toUpperCase());
    progressChart.graphStepData(goalArray, stepsArray);
  };

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

  let progress;
  if (dailySteps === 100) {
    progress = "Congratulations! You've reached your goal!";
  } else if (dailySteps === null) {
    progress = 'You have no step data! Check out the demo tab!';
  } else {
    progress = "You've still got more walking to do bud!";
  }

  let connected;
  connected = (
    <React.Fragment>
      <div className={'profile-card'}>
        <Card fluid>
          <Image src={context.picture} wrapped ui={false} fluid />
          <Card.Content>
            <Card.Header>{context.name}</Card.Header>
            <Card.Meta>Joined in 2019</Card.Meta>
            <Card.Description>{context.name} is an aspiring step taker.</Card.Description>
          </Card.Content>
        </Card>
      </div>
      <div className={'status'}>
        <h3>Current tier of browsing:</h3>
        <h1>{currentStatus}</h1>
      </div>
      <Goal />
      <Statistic className={'week-steps'}>
        <Statistic.Value className={'week-steps'}>{weeklySteps ? weeklySteps : 0}</Statistic.Value>
        <Statistic.Label className={'slabel'}>Steps Taken This Week</Statistic.Label>
      </Statistic>
      {/* {context.access_token ? ( temp change for fake user data*/}
      {context.name ? (
        <React.Fragment>
          <div className={'progress-bar'}>
            <Divider inverted />
            <p className={'progress'}>Today's Progress</p>
            <Progress percent={dailySteps} indicating progress inverted>
              {progress}
            </Progress>
            <Divider inverted />
          </div>
          <div className={'canvas'}>
            <canvas id={'ProgressChart'} style={{ width: '365px', height: '275px' }} />
          </div>
        </React.Fragment>
      ) : (
        <div className={'connect'}>
          <h2>Please connect your account to Google.</h2>
          <Connect />
        </div>
      )}
    </React.Fragment>
  );

  if (!context.name) {
    return <Redirect to="/login" />;
  }

  return <div className={'content-profile'}>{connected}</div>;
};

export default Profile;
