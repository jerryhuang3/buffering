import React from 'react';

const Rankings = ({ users, loading, usersPerPage, page }) => {
	
	const userClick = id =>{
		console.log("HI you clicked", id)
	}

  if (loading) {
    return <h2>Loading.....</h2>;
  }

  return (
    <div className={'user'}>
      {users.map((user, idx) => (
        <ul>
          <li className={'rank'}>{(idx + 1) + ((page - 1) * usersPerPage)}</li>
          <li className={'name'} onClick={() => userClick(user.id)}>{user.name}</li>
          <li className={'points'}>{user.total}</li>
          <li className={'steps'}>{user.total_steps}</li>
        </ul>
      ))}
    </div>
  );
};

export default Rankings;
