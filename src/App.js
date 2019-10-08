import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import { Error, EmailExists, WrongLogin } from './components/Error';
import Nav from './components/Nav';
import Connect from './components/Connect';
import Login from './components/Login';
import Signup from './components/Signup';
import Initialize from './components/Initialize';
import Demo from './components/Demo';
import User from './components/User';
import UserFriends from './components/UserFriends';
import Leaderboard from './components/Leaderboard';
import StateContext from './components/StateContext';

const App = () => {
  const ctx = useContext(StateContext);

  useEffect(() => {
    console.log('APP IS LOADING');
    window.gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: '677038605397-j26crueetoelsf8vh5f9pde9l93707r7.apps.googleusercontent.com',
        cookie_policy: 'single_host_origin',
        scope: 'https://www.googleapis.com/auth/fitness.activity.read'
      });
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/users', { method: 'POST' });
    const json = await response.json();
    if (json) {
      ctx.setId(json.id);
      ctx.setName(json.name);
      ctx.setAccessToken(json.access_token);
      ctx.setPicture(json.image_url);
    }
  };

  return (
    <Router>
      <div className={'container'}>
        {ctx.show_nav ? <Nav /> : <Nav />}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/user/:userId/friends" component={UserFriends} />
          <Route path="/user/:userId" component={User} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/connect" component={Connect} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/initialize" component={Initialize} />
          <Route path="/demo" component={Demo} />
          <Route exact path="/400/signup" component={EmailExists} />
          <Route path="/400/login" component={WrongLogin} />

          <Route component={Error} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
