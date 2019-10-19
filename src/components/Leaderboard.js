import React, { useState, useEffect } from 'react';
import Rankings from './Rankings';
import RankPages from './RankPages';
import utils from '../../helpers/utils';

const Leaderboard = props => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(12);
  const [pointsDirection, setPointsDirection] = useState('');
  const [stepsDirection, setStepsDirection] = useState('');
  const [isPointsAscending, setIsPointsAscending] = useState(true);
  const [isStepsAscending, setIsStepsAscending] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setUsersPerPage(10);
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('/leaderboard', { method: 'POST' });
    const data = await response.json();
    setUsers(data);
    setLoading(false);
  };

  const idxLastUser = currentPage * usersPerPage;
  const idxFirstUser = idxLastUser - usersPerPage;
  const currentUsers = users.slice(idxFirstUser, idxLastUser);

  const paginate = activePage => {
    setCurrentPage(activePage);
  };

  const sortByType = e => {
    const type = e.target.getAttribute('data-type');
    let sort;
    if (type === 'rank') {
      const direction = isPointsAscending ? 'desc' : 'asc';
      if (direction === 'asc') {
        sort = '▼';
      } else {
        sort = '▲';
      }
      const sortedUsers = utils.sortByType(users, type, direction);
      setUsers(sortedUsers);
      setPointsDirection(sort);
      setIsPointsAscending(!isPointsAscending);
      setStepsDirection('');
    } else {
      const direction = isStepsAscending ? 'desc' : 'asc';
      if (direction === 'asc') {
        sort = '▼';
      } else {
        sort = '▲';
      }
      const sortedUsers = utils.sortByType(users, type, direction);
      setUsers(sortedUsers);
      setStepsDirection(sort);
      setIsStepsAscending(!isStepsAscending);
      setPointsDirection('');
    }
  };

  return (
    <div className={'leaderboard'}>
      <h1>Leaderboard</h1>
      <div className={'leader-header'}>
        <ul>
          <li className={'rank-header'}>Rank</li>
          <li className={'name-header'}>Name</li>
          {isPointsAscending ? (
            <li data-type={'rank'} onClick={sortByType} value="points" className={'points-header'}>
              Points {pointsDirection}
            </li>
          ) : (
            <li data-type={'rank'} onClick={sortByType} className={'points-header'}>
              Points {pointsDirection}
            </li>
          )}
          {isStepsAscending ? (
            <li data-type={'total_steps'} onClick={sortByType} className={'steps-header'}>
              Weekly Steps {stepsDirection}
            </li>
          ) : (
            <li data-type={'total_steps'} onClick={sortByType} className={'steps-header'}>
              Weekly Steps {stepsDirection}
            </li>
          )}
        </ul>
      </div>
      <div className={'users'}>
        <Rankings users={currentUsers} loading={loading} />
      </div>
      <div className="pagination">
        <RankPages usersPerPage={usersPerPage} totalUsers={users.length} paginate={paginate} />
      </div>
    </div>
  );
};

export default Leaderboard;
