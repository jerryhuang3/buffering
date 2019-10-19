import React, { useState, useEffect, useContext } from 'react';
import { Progress } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import Card from './User/Card';
import Logs from './User/Logs';
import Stats from './User/Stats';
import Connect from './Connect.js';
import StateContext from './StateContext';
import utils from '../../helpers/utils';
import progressChart from '../utils/progress-chart';

const User = ({ match }) => {
  const ctx = useContext(StateContext);
  const userId = match.params.userId;
  const [user, setUser] = useState({});
  const [friendsList, setFriendsList] = useState(0);
  const [steps, setSteps] = useState([]);
  const [currentStatus, setStatus] = useState({});
  const [dailyProgress, setDailyProgress] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState(0);

  // Fetch user information on load
  useEffect(() => {
    fetchUser();
  }, [userId, ctx.name, ctx.access_token, currentStatus.level, ctx.goal_update]);

  const fetchUser = async () => {
    const response = await Promise.all([
      fetch(`/user/${userId}`, { method: 'POST' }),
      fetch(`/user/${userId}/data`, { method: 'POST' }),
      fetch(`/user/${userId}/friends`, { method: 'POST' })
    ]);
    const userProfile = await response[0].json();
    const userData = await response[1].json();
    const friendsObj = await response[2].json();

    const [stepsArray, goalArray] = [userData[0], userData[1]];
    let sumOfSteps = 0;
    for (let i = 0; i < stepsArray.length; i++) {
      sumOfSteps = sumOfSteps + stepsArray[i];
    }
    progressChart.graphStepData(goalArray, stepsArray);

    const userStatus = utils.computeUserStatus(stepsArray, goalArray);

    let progress;
    if (goalArray[0] === 0) {
      progress = 100;
    } else {
      progress = ((stepsArray[6] / goalArray[6]) * 100).toFixed(2);
    }

    setUser(userProfile);
    setFriendsList(friendsObj.friendsList.length);
    setSteps(stepsArray.reverse());
    setStatus(userStatus);
    setDailyProgress(progress);
    setWeeklySteps(sumOfSteps);
  };

  let progressMsg;
  if (dailyProgress >= 100) {
    progressMsg = "Congratulations! You've reached your goal!";
  } else if (dailyProgress === 0 || dailyProgress === null || dailyProgress === undefined) {
    progressMsg = 'You have no step data! Check out the demo tab!';
  } else {
    progressMsg = "You've still got more walking to do bud!";
  }

  return (
    <div className="user-container">
      <Card id={userId} user={user} />
      {ctx.access_token ? (
        <Logs user={user} steps={steps} />
      ) : (
        <div className={'connect'}>
          <h4>Please connect your account to Googlex.</h4>
          <Connect />
        </div>
      )}
      <div className="info">
        <div className="stats">
          <ul>
            <li>
              <h2>
                <NavLink to={`/user/${userId}/friends`}>{friendsList}</NavLink>
              </h2>
              <p>Friends</p>
            </li>
            <li>
              <h2>{user.total}</h2>
              <p>Points</p>
            </li>
            <li>
              <h2>
                <div style={{ color: `${currentStatus.color}`, textShadow: `${currentStatus.shadow}` }}>{currentStatus.level}</div>
              </h2>
              <p>Status</p>
            </li>
          </ul>
        </div>
      </div>
      <Stats user={user} weeklySteps={weeklySteps} />
      <div className="progress-bar">
        <p className="progress-msg">Today's Progress</p>
        <Progress percent={dailyProgress} indicating progress inverted>
          <p className="progress-msg">{progressMsg}</p>
        </Progress>
      </div>
      <div className="canvas">
        <canvas id={'ProgressChart'} />
      </div>
    </div>
  );
};

export default User;
