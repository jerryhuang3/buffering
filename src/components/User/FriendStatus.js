import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'semantic-ui-react';
import { checkPropTypes } from 'prop-types';

const FriendStatus = ({ id, isFriend }) => {
  const [friendStatus, setFriendStatus] = useState(2);
  const [friendButton, setFriendButton] = useState('');

  // Change button when friend status changes
  useEffect(() => {
    checkFriend();
  }, [friendStatus]);

  useEffect(() => {}, [id]);

  const checkFriend = async () => {
    const otherUser = parseInt(id);
    const response = await fetch('/friends/check_friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: otherUser })
    });
    const check = await response.json();
    let status;
    if (!check) {
      status = null;
    } else if (check.status === 0 && check.last_action_by !== otherUser) {
      status = 0;
    } else if (check.status === 1) {
      status = 1;
      isFriend(true);
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
          <Button color="blue" onClick={updateStatus} value={'add'}>
            Add Friend
          </Button>
        );
      case 0:
        return <Button disabled>Pending</Button>;
      case 1:
        return (
          <Button color="red" onClick={updateStatus} value={'remove'}>
            Remove Friend
          </Button>
        );
      case 2:
        return (
          <Button color="green" onClick={updateStatus} value={'accept'}>
            Accept Friend
          </Button>
        );
    }
  };

  const updateStatus = async e => {
    if (e.target.value === 'add') {
      const add = await fetch('/friends/add_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
      });
      const response = await add.json();
      if (response.action === 'completed') {
        setFriendStatus(0);
      }
    } else if (e.target.value === 'accept') {
      const accept = await fetch('/friends/accept_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
      });
      const response = await accept.json();
      if (response.action === 'completed') {
        setFriendStatus(1);
      }
    } else if (e.target.value === 'remove') {
      if (window.confirm('Are you sure you want to remove this friend?')) {
        const remove = await fetch('/friends/remove_friend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: id })
        });
        const response = await remove.json();
        if (response.action === 'completed') {
          setFriendStatus(null);
        }
      }
    }
  };

  return <div className="add-friend">{friendButton}</div>;
};

export default FriendStatus;
