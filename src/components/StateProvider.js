import React, { useState } from 'react';
import StateContext from './StateContext';

const StateProvider = props => {
  const [id, setId] = useState(null);
  const [name, setName] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [showNav, setNav] = useState(true);
  const [picture, setPicture] = useState(null);
  const [goalUpdate, setGoalUpdate] = useState(false);

  return (
    <StateContext.Provider
      value={{
        id: id,
        name: name,
        access_token: accessToken,
        show_nav: showNav,
        picture: picture,
        goal_update: goalUpdate,
        setId: id => {
          setId(id);
        },
        setName: name => {
          setName(name);
        },
        setAccessToken: token => {
          setAccessToken(token);
        },
        setNav: bool => {
          setNav(bool);
        },
        setPicture: picture => {
          setPicture(picture);
        },
        setGoalUpdate: goal => {
          setGoalUpdate(goal);
        }
      }}>
      {props.children}
    </StateContext.Provider>
  );
};

export default StateProvider;
