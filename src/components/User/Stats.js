import React, { useState, useEffect, useContext } from 'react';
import { Statistic } from 'semantic-ui-react';
import Goal from './Goal.js';

const Stats = ({ weeklySteps }) => {
  return (
    <div className="extra-stats">
      <Statistic>
        <Statistic.Value>{weeklySteps ? weeklySteps : 0}</Statistic.Value>
        <Statistic.Label>Steps Taken This Week</Statistic.Label>
      </Statistic>
      {/* <Goal /> */}
    </div>
  );
};

export default Stats;
