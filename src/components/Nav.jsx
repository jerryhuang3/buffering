import React, { Component } from "react";
import { Link } from "react-router-dom";
import Authentication from "./Authentication.jsx";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.session = this.session.bind(this);
  }

  // Receives session prop after clicking Login or Logout button
  session(bool) {
    this.props.auth(bool);
  }

  render() {
    // Nav receives state of the session from App.jsx
    const isUserLoggedIn = this.props.session;
    const session = this.props.session ? (
      <div>
        <p>Hey! You are logged in!</p>
        <div style={{ border: "2px solid black", width: "108px" }}>
          <Authentication session={isUserLoggedIn} logout={this.session} />
        </div><br/>
        <Link to="/">Home |</Link>
        <Link to="/profile"> Profile</Link>
        <hr />
      </div>
    ) : (
      <div>
        <p>Hey! You are not logged in!</p>
        <div style={{ border: "2px solid black", width: "98px" }}>
          <Authentication session={isUserLoggedIn} login={this.session} />
        </div><br/>
        <Link to="/">Home |</Link>
        <Link to="/profile"> Profile</Link>        
        <hr />
      </div>
    );

    return <div>{session}</div>;
  }
}

export default Nav;
