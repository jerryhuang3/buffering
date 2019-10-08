import React, { useEffect } from 'react';
import { weekArray } from '../../../helpers/utils';
import moment from 'moment';

const Logs = ({ user, steps }) => {
  useEffect(() => {}, [steps]);
  const pastWeek = weekArray().map((day, idx) => {
    if (idx === 0) {
      return 'today';
    }
    if (idx === 1) {
      return 'yesterday';
    }
    return 'on ' + moment(day).format('MMMM Do, YYYY');
  });

  const history = steps.map((step, idx) => (
    <li key={idx}>
      {user.name} took {step} steps {pastWeek[idx]}!
    </li>
  ));

  return (
    <div className="user-logs">
      <div className="user-log">
        <h1>History</h1>
        <ul>{history}</ul>
      </div>
    </div>
  );
};

export default Logs;
