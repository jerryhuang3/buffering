import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import { Error, EmailExists, WrongLogin } from './components/Error';
import Nav from './components/Nav';
import Connect from './components/Connect';
import Login from './components/Login';
import Signup from './components/Signup';
import Initialize from './components/Initialize';
import Demo from './components/Demo';
import StateContext from './components/StateContext';

const App = () => {
  const context = useContext(StateContext);

  useEffect(() => {
    window.gapi.load('auth2', () => {
      let auth2 = gapi.auth2.init({
        apiKey: 'AIzaSyAvxeOb22g-FUMwG6oyIgOjeLUNF6jn55U',
        client_id: '677038605397-j26crueetoelsf8vh5f9pde9l93707r7.apps.googleusercontent.com',
        cookie_policy: 'single_host_origin',
        scope: 'https://www.googleapis.com/auth/fitness.activity.read'
      });
    });

    const fetchData = async () => {
      const response = await fetch('/', { method: 'POST' });
      const json = await response.json();
      if (!json) {
      } else {
        context.setName(json.name);
        context.setGoogleSession(true);
        context.setAccessToken(json.access_token);
        context.setPicture(json.image_url);
      }
    };
    fetchData();
  }, []);

  return (
    <Router>
      <div className={'container'}>
        {context.show_nav ? <Nav /> : <Nav />}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/profile" component={Profile} />
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
