import React, { useState, useEffect, useContext } from 'react';
import StateContext from './StateContext';

const FriendStatus = ({ path }) => {
  const context = useContext(StateContext);
  const [friendStatus, setFriendStatus] = useState(2);
  const [friendButton, setFriendButton] = useState('');

  // Change button when friend status changes
  useEffect(() => {
    checkFriend();
  }, [friendStatus]);

  const checkFriend = async () => {
    const otherUser = parseInt(path.slice(6));
    const response = await fetch('/friends/check_friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: otherUser })
    });
    const check = await response.json();
    console.log(check);
    let status;

    if (!check) {
      status = null;
    } else if (check.status === 0 && check.last_action_by !== otherUser) {
      status = 0;
    } else if (check.status === 1) {
      status = 1;
    } else if (check.last_action_by === otherUser && check.status !== 1) {
      status = 2;
    }
    const button = friendsButton(status);
    setFriendButton(button);
  };

  const friendsButton = status => {
    switch (status) {
      case null:
        return (
          <button onClick={newStatus} value={'add'}>
            ADD FRIEND
          </button>
        );
      case 0:
        return <button>PENDING</button>;
      case 1:
        return (
          <button onClick={newStatus} value={'remove'}>
            REMOVE FRIEND
          </button>
        );
      case 2:
        return (
          <button onClick={newStatus} value={'accept'}>
            ACCEPT FRIEND
          </button>
        );
    }
  };

  //facebook path ajax/add_friend/action.php
  const newStatus = async e => {
    if (e.target.value === 'add') {
      console.log('ADDING FRIEND');
      const add = await fetch('/friends/add_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: path.slice(6) })
      });
      const response = await add.json();
      if (response.action === 'completed') {
        setFriendStatus(0);
      }
    } else if (e.target.value === 'accept') {
      console.log('ACCEPTING FRIEND');
      const accept = await fetch('/friends/accept_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: path.slice(6) })
      });
      const response = await accept.json();
      if (response.action === 'completed') {
        setFriendStatus(1);
      }
    } else if (e.target.value === 'remove') {
      console.log('REMOVING FRIEND');
      const remove = await fetch('/friends/remove_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: path.slice(6) })
      });
      const response = await remove.json();
      if (response.action === 'completed') {
        setFriendStatus(null);
      }
    }
  };

  return <div className="add-friend">{friendButton}</div>;
};

export default FriendStatus;
