import React, { Component } from 'react';
import { NavLink, Redirect, withRouter } from 'react-router-dom';
import { Container, Image, Menu } from 'semantic-ui-react';
import Authentication from './Authentication.jsx';

class Nav extends Component {
  constructor(props) {
    super(props);
    this.session = this.session.bind(this);
    this.logout = this.logout.bind(this);
  }

  // Receives session prop after clicking Login or Logout button
  session(name, bool, access) {
    this.props.auth(name, bool, access);
  }

  logout() {
    console.log('Nav: Logging out');
    fetch('/logout', { method: 'POST' });
    this.props.history.push('/'); // REDIRECT IS WORKING BUT NAV not refreshing
  }

  render() {
    // Nav receives state of the session from App.jsx
    console.table(this.props.state);
    const isUserLoggedIn = this.props.state.name;

    const session = this.props.state.session ? (
      <Container>
        <Menu.Menu position="left">
          <Menu.Item>
            <NavLink to="/">Home</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/profile">Profile</NavLink>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <h3>Hey {this.props.state.name}! You are logged in!</h3>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item>
            <button onClick={this.logout}>Logout</button>
          </Menu.Item>
          {/* <Menu.Item>
            <Authentication session={isUserLoggedIn} logout={this.session} />
          </Menu.Item> */}
        </Menu.Menu>
      </Container>
    ) : (
      <Container>
        <Menu.Menu position="left">
          <Menu.Item>
            <NavLink to="/">Home</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/profile">Profile</NavLink>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu>
          <h3>Hey! You are not logged in!</h3>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item>
            <NavLink to="/login">Login</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/signup">Signup</NavLink>
          </Menu.Item>
          {/* <Menu.Item>
            <Authentication session={isUserLoggedIn} login={this.session} />
          </Menu.Item> */}
        </Menu.Menu>
      </Container>
    );

    return <Menu>{session}</Menu>;
  }
}

export default withRouter(Nav);
