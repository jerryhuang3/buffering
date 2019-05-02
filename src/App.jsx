import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import Error from './components/Error.jsx';
import Nav from './components/Nav.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      session: false,
      access_token: null
    };

    this.session = this.session.bind(this);
  }

  async componentDidMount() {
    // Check for cookie session
    try {
      const response = await fetch('/', { method: 'POST' });
      if (!response.ok) {
        throw Error(response.statusText);
      }
      const json = await response.json();
      if (!json) {
        console.log('No cookie');
      } else {
        console.log('COOKIE EXISTS! SETTING SESSION TO TRUE');
        console.table(json);
        this.test;
        this.setState({ name: json.name, session: true, access_token: json.access_token });
      }
    } catch (err) {
      console.log(err);
    }
  }

  // Receives session prop from Nav component which receives session prop from Authentication component
  session(name, bool, access) {
    console.log('App.jsx session', name, bool, access);
    this.setState({ name: name, session: bool, access_token: access });
  }

  render() {
    console.log(this.state);
    return (
      <Router>
        <div>
          <Nav state={this.state} auth={this.session} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              path="/login"
              render={props => <Login {...props} session={this.state.session} />}
            />
            <Route
              path="/signup"
              render={props => <Signup {...props} session={this.state.session} />}
            />
            <Route path="/profile" render={props => <Profile {...props} data={this.state} />} />
            <Route component={Error} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
