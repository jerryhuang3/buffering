import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const UserFriends = ({ match }) => {
  const userId = match.params.userId;

  const [friends, setFriends] = useState([]);
  const [firstName, setFirstName] = useState('');
  useEffect(() => {
    console.log(match.params.userId);
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    const response = await fetch(`/user/${userId}/friends`, { method: 'POST' });
    const { friendsList, userName } = await response.json();
    setFirstName(userName.name.split(' ')[0]);
    setFriends(friendsList);
  };

  const friend = friends.map(friend => (
    <div className="friend">
      <div className="friend-image">
        <img src={friend.image_url} />
      </div>
      <p>
        <NavLink to={`/user/${friend.id}`}>{friend.name}</NavLink>
      </p>
    </div>
  ));
  return (
    <div className="friends-container">
      <h1>{firstName}'s Friends</h1>
      <div className="user-friends">{friend}</div>
    </div>
  );
};

export default UserFriends;
