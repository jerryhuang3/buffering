import React, { useState } from 'react';
import StateContext from './StateContext';

const StateProvider = props => {
  const [name, setName] = useState(null);
  const [googleSession, setGoogleSession] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [showNav, setNav] = useState(true);
  const [picture, setPicture] = useState(null);
  const [goalUpdate, setGoalUpdate] = useState(false);

  return (
    <StateContext.Provider
      value={{
        name: name,
        google_session: googleSession,
        access_token: accessToken,
        show_nav: showNav,
        picture: picture,
        goal_update: goalUpdate,
        setName: name => {
          setName(name);
        },
        setGoogleSession: bool => {
          setGoogleSession(bool);
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
