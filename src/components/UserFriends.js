import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const UserFriends = ({ match }) => {
  const userId = match.params.userId;

  const [friends, setFriends] = useState([]);
  const [firstName, setFirstName] = useState('');
  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const response = await fetch(`/user/${userId}/friends`, { method: 'POST' });
    const { friendsList, userName } = await response.json();
    setFirstName(userName.name.split(' ')[0]);
    setFriends(friendsList);
  };

  const friend = friends.map(friend => (
    <li className="friend">
      <div className="friend-image">
        <img src={friend.image_url} />
      </div>
        <NavLink to={`/user/${friend.id}`}><p>{friend.name}</p></NavLink>
    </li>
  ));
  return (
    <div className="friends-container">
      <h1>{firstName}'s Friends</h1>
      <ul className="user-friends">{friend}</ul>
    </div>
  );
};

export default UserFriends;
