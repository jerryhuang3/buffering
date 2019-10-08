import React from 'react';
import { NavLink } from 'react-router-dom';

const Rankings = ({ users, loading}) => {
  const userClick = id => {
  };

  if (loading) {
    return <h2>Loading.....</h2>;
  }

  return (
    <div className={'user'}>
      {users.map((user, idx) => (
        <ul key={idx}>
          <li className={'rank'}>{user.rank}</li>
          <li className={'name'} onClick={() => userClick(user.id)}>
            <NavLink to={`/user/${user.id}`}>{user.name}</NavLink>
          </li>
          <li className={'points'}>{user.total}</li>
          <li className={'steps'}>{user.total_steps}</li>
        </ul>
      ))}
    </div>
  );
};

export default Rankings;
