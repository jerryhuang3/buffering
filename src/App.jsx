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
import Initialize from './components/Initialize.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: null,
      google_session: false,
      access_token: null,
      show_nav: true,
      picture: null
    };
  }

  async componentDidMount() {
    await window.gapi.load('auth2', () => {
      let auth2 = gapi.auth2.init({
        apiKey: 'AIzaSyAvxeOb22g-FUMwG6oyIgOjeLUNF6jn55U',
        client_id: '677038605397-j26crueetoelsf8vh5f9pde9l93707r7.apps.googleusercontent.com',
        cookie_policy: 'single_host_origin',
        scope: 'https://www.googleapis.com/auth/fitness.activity.read'
      });
     
      console.log("YO! Is user signed in to google already??", auth2.isSignedIn.get());
      
    });
  
    const response = await fetch('/', { method: 'POST' });
    const json = await response.json();
    if (!json) {
      console.log('No cookie');
    } else {
      console.log('COOKIE EXISTS! SETTING SESSION TO TRUE');
      console.table(json);
      this.setState({
        name: json.name,
        google_session: true,
        access_token: json.access_token,
        picture: json.image_url
      }); 
    }
  }

  // Receives session prop from Nav component which receives session prop from Authentication component
  connect = (name, bool, access) => {
    console.log(name, bool, access);
    this.setState({ name: name, google_session: bool, access_token: access});
  }

  noNav = () => {
    this.setState({ show_nav: false });
  };

  render() {
    console.table(this.state);
    return (
      <Router>
        <div>
          {this.state.show_nav ? <Nav state={this.state} auth={this.connect} /> : null}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" render={props => <Profile {...props} data={this.state} connect={this.connect} />} />
            <Route path="/widget" render={props => <Widget {...props} noNav={this.noNav} data={this.state} />} />
            <Route path="/connect" render={props => <Connect {...props} />} />
            <Route path="/login" render={props => <Login {...props} login={this.connect} session={this.state.google_session} />} />
            <Route path="/signup" render={props => <Signup {...props} signup={this.connect} session={this.state.google_session} />} />
            <Route path="/initialize" render={props => <Initialize {...props} data={this.state} />} />
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
