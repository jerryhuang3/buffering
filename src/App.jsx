import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Profile from "./components/Profile.jsx";
import Error from "./components/Error.jsx";
import Nav from "./components/Nav.jsx";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Nav />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/profile" component={Profile} />
          <Route component={Error} />
        </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
