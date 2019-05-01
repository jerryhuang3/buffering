import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Image, Menu } from 'semantic-ui-react';
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
    console.log(this.props.state);
    const isUserLoggedIn = this.props.state.name;

    const session = this.props.state.session ? (
      <Container>
        <Menu.Menu position="left">
          <Menu.Item>
            <NavLink to="/">Home</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/profile"> Profile</NavLink>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="center"><h3>Hey {this.props.state.name}! You are logged in!</h3></Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item>
            <Authentication session={isUserLoggedIn} logout={this.session} />
          </Menu.Item>
        </Menu.Menu>
      </Container>
    ) : (
      <Container>
        <Menu.Menu position="left">
          <Menu.Item>
            <NavLink to="/">Home</NavLink>
          </Menu.Item>
          <Menu.Item>
            <NavLink to="/profile"> Profile</NavLink>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position="center">
          <h3>Hey! You are not logged in!</h3>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item>
            <Authentication session={isUserLoggedIn} login={this.session} />
          </Menu.Item>
        </Menu.Menu>
      </Container>
    );

    return (
      <Menu>
        {session}
      </Menu>
    );
  }
}

export default Nav;
