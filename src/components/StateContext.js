import React from 'react';

export default React.createContext({
  name: null,
  access_token: null,
  show_nav: true,
  picture: null,
  goal_update: false,
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
});
