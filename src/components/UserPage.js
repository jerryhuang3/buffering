import React, { useState, useEffect } from 'react';
import { Card, Image, Statistic, Icon } from 'semantic-ui-react';
import progressChart from '../utils/progress-chart';

const UserPage = () => {
  const [user, setUser] = useState({});
  const [weeklySteps, setWeeklySteps] = useState(null);

  useEffect(() => {
    fetchUser();
    console.log(window.location.pathname);
  }, []);

  const fetchUser = async () => {
    const path = window.location.pathname;
    const response = await Promise.all([fetch(path, { method: 'post' }), fetch(`${path}/data`, { method: 'post' })]);
    const userProfile = await response[0].json();
    const userData = await response[1].json();
    const [stepsArray, goalArray] = [userData[0], userData[1]];
    console.log(goalArray);
    if (!stepsArray) {
      stepsArray = [0, 0, 0, 0, 0, 0, 0];
    }
    let sumOfSteps = 0;
    for (let i = 0; i < stepsArray.length; i++) {
      sumOfSteps = sumOfSteps + stepsArray[i];
    }

    progressChart.graphStepData(goalArray, stepsArray);
    setUser(userProfile);
    setWeeklySteps(sumOfSteps);
  };

  return (
    <div className={'user-profile'}>
      <div className={'profile-card'}>
        <Card fluid>
          <Image src={user.image_url} wrapped ui={false} fluid />
          <Card.Content>
            <Card.Header>{user.name}</Card.Header>
            <Card.Meta>Joined in 2019</Card.Meta>
            <Card.Description>{user.name} is an aspiring step taker.</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name="money bill alternate" />
              Points: {user.total}
            </a>
          </Card.Content>
        </Card>
      </div>
      <Statistic className={'week-steps'}>
        <Statistic.Value className={'week-steps'}>{weeklySteps ? weeklySteps : 0}</Statistic.Value>
        <Statistic.Label className={'slabel'}>Steps Taken This Week</Statistic.Label>
      </Statistic>

      <div className={'canvas'}>
        <canvas id={'ProgressChart'} style={{ width: '365px', height: '300px' }} />
      </div>
    </div>
  );
};

export default UserPage;
