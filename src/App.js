import React, { useState, useEffect } from 'react';
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

const App = () => {
  const [state, setState] = useState({
    name: null,
    google_session: false,
    access_token: null,
    show_nav: true,
    picture: null
  });

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
        console.log('SETTING STATE ON APP');
        setState({
          name: json.name,
          google_session: true,
          access_token: json.access_token,
          picture: json.image_url
        });
      }
    };
    fetchData();
    console.log('show nav status', state.show_nav);
  }, []);

  // Receives session prop from Nav component which receives session prop from Authentication component
  const connect = (name, bool, access) => {
    console.log(name, bool, access);
    setState({ name: name, google_session: bool, access_token: access });
  };

  const noNav = () => {
    setState({ show_nav: false });
  };

  let nav = '';

  if (state.show_nav) {
    console.log('NAV EXIETS');
    nav = <Nav state={state} auth={connect} ></Nav>;
  } else {
    nav = null;
  }

  return (
    <Router>
      <div>
        {nav}
        <Nav state={state} auth={connect} />
        {/* {state.show_nav ? <Nav state={state} auth={connect} /> : null} */}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/profile" render={props => <Profile {...props} data={state} connect={connect} />} />
          <Route path="/widget" render={props => <Widget {...props} noNav={noNav} data={state} />} />
          <Route path="/connect" render={props => <Connect {...props} />} />
          <Route path="/login" render={props => <Login {...props} login={connect} session={state.google_session} />} />
          <Route path="/signup" render={props => <Signup {...props} signup={connect} session={state.google_session} />} />
          <Route path="/initialize" render={props => <Initialize {...props} data={state} />} />
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
