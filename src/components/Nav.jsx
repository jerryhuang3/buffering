import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Authentication from './Authentication.jsx';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.session = this.session.bind(this);
  }

  // Receives session prop after clicking Login or Logout button
  session(name, bool, access) {
    this.props.auth(name, bool, access);
  }

  render() {
    // Nav receives state of the session from App.jsx
    console.log(this.props.state)
    const isUserLoggedIn = this.props.state.name;
    const session = this.props.state.session ? (
      <div>
        <p>Hey {this.props.state.name}! You are logged in!</p>
        <div style={{ border: '2px solid black', width: '108px' }}>
          <Authentication session={isUserLoggedIn} logout={this.session} />
        </div>
        <br />
        <NavLink to="/">Home |</NavLink>
        <NavLink to="/profile"> Profile</NavLink>
        <hr />
      </div>
    ) : (
      <div>
        <p>Hey! You are not logged in!</p>
        <div style={{ border: '2px solid black', width: '98px' }}>
          <Authentication session={isUserLoggedIn} login={this.session} />
        </div>
        <br />
        <NavLink to="/">Home |</NavLink>
        <NavLink to="/profile"> Profile</NavLink>
        <hr />
      </div>
    );

    return <div>{session}</div>;
  }
}

export default Nav;
