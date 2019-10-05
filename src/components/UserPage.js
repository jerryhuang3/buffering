import React, { useState, useEffect } from 'react';
import { Card, Image, Statistic, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import StateContext from './StateContext';
import FriendStatus from './FriendStatus';
import progressChart from '../utils/progress-chart';

const UserPage = () => {
  const path = window.location.pathname;

  const [user, setUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [weeklySteps, setWeeklySteps] = useState(null);

  // Fetch user information on load
  useEffect(() => {
    fetchUser();
  }, [window.location.pathname]);

  const fetchUser = async () => {
    const response = await Promise.all([
      fetch(path, { method: 'POST' }),
      fetch(`${path}/data`, { method: 'POST' }),
      fetch(`${path}/friends`, { method: 'POST' })
    ]);
    const userProfile = await response[0].json();
    const userData = await response[1].json();
    const friendsObj = await response[2].json();
    const [friendsList] = [friendsObj.friendsList];
    const [stepsArray, goalArray] = [userData[0], userData[1]];
    if (!stepsArray) {
      stepsArray = [0, 0, 0, 0, 0, 0, 0];
    }
    let sumOfSteps = 0;
    for (let i = 0; i < stepsArray.length; i++) {
      sumOfSteps = sumOfSteps + stepsArray[i];
    }
    progressChart.graphStepData(goalArray, stepsArray);

    setUser(userProfile);
    setFriends(friendsList);
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
      <FriendStatus path={path} />
      <Statistic className={'week-steps'}>
        <Statistic.Value className={'week-steps'}>{weeklySteps ? weeklySteps : 0}</Statistic.Value>
        <Statistic.Label className={'slabel'}>Steps Taken This Week</Statistic.Label>
      </Statistic>
      <div className="friends">
        <h3>Friends</h3>
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>
              <NavLink to={`/user/${friend.id}`}>{friend.name}</NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className={'canvas'}>
        <canvas id={'ProgressChart'} style={{ width: '365px', height: '300px' }} />
      </div>
    </div>
  );
};

export default UserPage;
