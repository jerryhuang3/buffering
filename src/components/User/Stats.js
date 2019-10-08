import React, { useState, useEffect, useContext } from 'react';
import { Statistic } from 'semantic-ui-react';
import Goal from './Goal.js';
import StateContext from '../StateContext';

const Stats = ({ user, weeklySteps }) => {
  const ctx = useContext(StateContext);

  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (user.id && user.id === ctx.id) {
      setIsOwnProfile(true);
    }
  }, [user]);

  return (
    <div className="extra-stats">
      <Statistic>
        <Statistic.Value>{weeklySteps ? weeklySteps : 0}</Statistic.Value>
        <Statistic.Label>Steps Taken This Week</Statistic.Label>
      </Statistic>
      {isOwnProfile ? <Goal /> : ''}
    </div>
  );
};

export default Stats;
