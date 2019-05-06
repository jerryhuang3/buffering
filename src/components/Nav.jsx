import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Menu, Button } from 'semantic-ui-react';

class Nav extends Component {
  constructor(props) {
    super(props);
  }
 
  // Receives session prop after clicking Login or Logout button
  session = (name, bool, access) => {
    this.props.auth(name, bool, access);
  }

  logout = async() => {
    const res = await fetch('/logout', { method: 'POST' });
    const logout = await res.json();
 
    let auth2 = gapi.auth2.getAuthInstance()
    // Sign out of Google on local website
    auth2.signOut().then(() => auth2.disconnect())
    console.log(gapi.auth2.getAuthInstance().currentUser.get())

    if (logout) {
      this.session(null, false, null);
      this.props.history.push('/');
    }
  }

  render() {
    // Nav receives state of the session from App.js
    const session = this.props.state.google_session ? (
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
          <h3 style={{color:'black'}}>Hey {this.props.state.name}! You are logged in!</h3>
        </Menu.Menu>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button onClick={this.logout}>Logout</Button>
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
        </Menu.Menu>
      </Container>
    );

    return <Menu>{session}</Menu>;
  }
}

export default withRouter(Nav);
