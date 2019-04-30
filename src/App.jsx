import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Home from "./components/Home.jsx";
import Profile from "./components/Profile.jsx";
import Error from "./components/Error.jsx";
import Nav from "./components/Nav.jsx";


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: false
    };

    this.session = this.session.bind(this);
  }

  // Receives session prop from Nav component which receives session prop from Authentication component
  session(bool) {
    this.setState({ session: bool });
  }

  render() {
    return (
      <Router>
        <div>
          <Nav session={this.state.session} auth={this.session} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/profile" component={Profile} />
            <Route component={Error} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
