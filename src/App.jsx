import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import Error from './components/Error.jsx';
import Nav from './components/Nav.jsx';

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

  componentDidMount() {
    // Check for cookie session
    fetch('/', { method: 'POST' })
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data)
        if (!data) {
          console.log('No cookie');
          this.setState({ session: false});
        } else {
          console.log('COOOKIE IS', data);
          this.setState({name: data.name, session: true, access_token: data.access_token })
        }
      });

  }

  // Receives session prop from Nav component which receives session prop from Authentication component
  session(name, bool, access) {
    console.log("App.jsx session", name, bool, access);
    this.setState({ name: name, session: bool, access_token: access })
  }

  render() {
    console.log(this.state);
    return (
      <Router>
        <div>
          <Nav state={this.state} auth={this.session} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" render={(props) => <Profile {...props} data={this.state} />} />
            <Route component={Error} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
