import React, { useState, useEffect, useContext } from 'react';
import FriendStatus from './FriendStatus';
import StateContext from '../StateContext';

const Card = ({ id, user }) => {
  const ctx = useContext(StateContext);

  const [isLoading, setIsLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);

  useEffect(() => {
    if (user.id && ctx.id && ctx.id !== user.id) {
      setIsOwnProfile(false);
    }
    if (user.id) {
      setIsLoading(false);
    }
  }, [user]);

  return (
    <div className="profile-card">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <React.Fragment>
          <img src={user.image_url} />
          <h3>{user.name}</h3>
          <p>{isOwnProfile ? 'You are' : `${user.name} is`} an aspiring step taker.</p>
          {isOwnProfile ? '' : <FriendStatus id={id} />}
        </React.Fragment>
      )}
    </div>
  );
};

export default Card;
