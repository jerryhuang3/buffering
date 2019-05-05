import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import { Error, EmailExists, WrongLogin } from './components/Error.jsx';
import Nav from './components/Nav.jsx';
import Widget from './components/Widget';
import Connect from './components/Connect';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      session: false,
      access_token: null,
      show_nav: true,
      google_id: null
    };
  }

  async componentDidMount() {
    window.gapi.load('auth2', async function() {
      let auth2 = gapi.auth2.init({
        apiKey: 'AIzaSyAvxeOb22g-FUMwG6oyIgOjeLUNF6jn55U',
        client_id: '677038605397-j26crueetoelsf8vh5f9pde9l93707r7.apps.googleusercontent.com',
        cookie_policy: 'single_host_origin',
        scope: 'https://www.googleapis.com/auth/fitness.activity.read'
      });
      // const test = await gapi.auth2.getAuthInstance();
      // console.log(auth2);
      console.log("YO! Is user signed in to google already??", auth2.isSignedIn.get())
     
    });

    // Check for cookie session
    const response = await fetch('/', { method: 'POST' });
    const json = await response.json();
    if (!json) {
      console.log('No cookie');
    } else {
      console.log('COOKIE EXISTS! SETTING SESSION TO TRUE');
      console.table(json);
      this.test;
      this.setState({
        name: json.name,
        session: true,
        access_token: json.access_token,
        google_id: json.google_id
      });
    }
  }

  // Receives session prop from Nav component which receives session prop from Authentication component
  session = (name, bool, access) => {
    this.setState({ name: name, session: bool, access_token: access });
  }

  noNav = () => {
    this.setState({ show_nav: false });
  };

  render() {
    console.log(this.state);
    return (
      <Router>
        <div>
          {this.state.show_nav ? <Nav state={this.state} auth={this.session} /> : null}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" render={props => <Profile {...props} data={this.state} />} />
            <Route path="/widget" render={props => <Widget {...props} noNav={this.noNav} data={this.state} />} />
            <Route path="/connect" render={props => <Connect {...props} login={this.session} session={this.state.session} />} />
            <Route path="/login" render={props => <Login {...props} login={this.session} session={this.state.session} />} />
            <Route path="/signup" render={props => <Signup {...props} signup={this.session} session={this.state.session} />} />
            <Route exact path="/400/signup" component={EmailExists} />
            <Route path="/400/login" component={WrongLogin} />
            <Route component={Error} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
