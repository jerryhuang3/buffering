import React, { useState, useEffect } from 'react';
import Rankings from './Rankings';
import RankPages from './RankPages';

const Leaderboard = props => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(12);

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

  return (
    <div className={'leaderboard'}>
      <h1>Leaderboard</h1>
      <div className={'leader-header'}>
        <ul>
          <li className={'rank-header'}>Rank</li>
          <li className={'name-header'}>Name</li>
          <li className={'points-header'}>Points</li>
          <li className={'steps-header'}>Weekly Steps</li>
        </ul>
      </div>
      <div className={'users'}>
        <Rankings users={currentUsers} loading={loading} page={currentPage} usersPerPage={usersPerPage} />
      </div>
      <div className="pagination">
        <RankPages usersPerPage={usersPerPage} totalUsers={users.length} paginate={paginate} />
      </div>
    </div>
  );
};

export default Leaderboard;
