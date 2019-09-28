import React, { useState, useEffect, useContext } from 'react';
import dataUtils from '../utils/data-utils';
import utils from '../../helpers/utils.js';
import Goal from './Goal.js';
import { Grid, Divider, Card, Icon, Image, Progress, Statistic } from 'semantic-ui-react';
import progressChart from '../utils/progress-chart';
import Connect from './Connect.js';
import StateContext from './StateContext';

const Profile = () => {
  const [dailySteps, setDailySteps] = useState(null);
  const [weeklySteps, setWeeklySteps] = useState(null);
  const [currentStatus, setStatus] = useState(null);

  const context = useContext(StateContext);

  useEffect(() => { 
    fetchData();
  }, Object.values(context));

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
        setStatus(userStatus.toUpperCase());
        progressChart.graphStepData(goalArray, stepsArray);
      } else {
        progressChart.graphStepData(goalArray, [0, 0, 0, 0, 0, 0, 0]);
      }
  }

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
    progress = "Congratulations! You've reached your goal for today!";
  } else if (dailySteps === null) {
    progress = "You either have no data or Google Fit didn't connect! Check out the demo tab!";
  } else {
    progress = "You've still got more walking to do bud!";
  }
  let connected;
  // if (!context.access_token) {
  //   connected = (
  //     <div className="connect">
  //       <Grid centered>
  //         <Grid.Row>
  //           <Grid.Column>
  //             <Connect />
  //           </Grid.Column>
  //         </Grid.Row>
  //       </Grid>
  //     </div>
  //   );
  // } else {
    connected = (
      <React.Fragment>
        <div className={'profile-card'}>
          <Card>
            <Image src={context.picture} wrapped ui={false} circular />
            <Card.Content>
              <Card.Header>{context.name}</Card.Header>
              <Card.Meta>Joined in 2019</Card.Meta>
              <Card.Description>{context.name} is an aspiring step taker.</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name="money bill alternate" />
                Points: 15
              </a>
            </Card.Content>
          </Card>
        </div>
        <div className={'status'}>
          <h3>Current tier of browsing:</h3>
          <h1>{currentStatus}</h1>
        </div>
        <Goal />
        <Statistic className="semantic">
          <Statistic.Value className="semantic">{weeklySteps ? weeklySteps : 0}</Statistic.Value>
          <Statistic.Label className="slabel">Steps Taken This Week</Statistic.Label>
        </Statistic>
        <div className={'progress-bar'}>
          <Divider inverted />
          <p className="progress">Today's Progress</p>
          <Progress percent={dailySteps} indicating progress inverted>
            {progress}
          </Progress>
          <Divider inverted />
        </div>
        <div className={'canvas'}>
          <canvas id="ProgressChart" />
        </div>
      </React.Fragment>
    );
  // }
  return <div className={'content-profile'}>{connected}</div>;
};

export default Profile;
