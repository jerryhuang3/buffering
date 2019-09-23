import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import { Error, EmailExists, WrongLogin } from './components/Error';
import Nav from './components/Nav';
import Widget from './components/Widget';
import Connect from './components/Connect';
import Login from './components/Login';
import Signup from './components/Signup';
import Initialize from './components/Initialize';
import Demo from './components/Demo';
import Tech from './components/Tech';
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
      <div>
        {context.show_nav ? <Nav /> : <Nav/>}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/profile" render={props => <Profile {...props} />} />
          <Route path="/widget" render={props => <Widget {...props} />} />
          <Route path="/connect" render={props => <Connect {...props} />} />
          <Route path="/login" render={props => <Login {...props} />} />
          <Route path="/signup" render={props => <Signup {...props} />} />
          <Route path="/initialize" render={props => <Initialize {...props} />} />
          <Route path="/demo" render={props => <Demo {...props} />} />
          <Route path="/tech" render={props => <Tech {...props} />} />
          <Route exact path="/400/signup" component={EmailExists} />
          <Route path="/400/login" component={WrongLogin} />
          <Route component={Error} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
