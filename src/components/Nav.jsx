import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Container, Menu, Button } from 'semantic-ui-react';

const Nav = props => {
  // Receives session prop after clicking Login or Logout button
  const session = (name, bool, access) => {
    props.auth(name, bool, access);
  };

  const logout = async () => {
    const res = await fetch('/logout', { method: 'POST' });
    const logout = await res.json();

    let auth2 = gapi.auth2.getAuthInstance();
    // Sign out of Google on local website
    auth2.signOut().then(() => auth2.disconnect());

    if (logout) {
      session(null, false, null);
      props.history.push('/');
    }
  };

  // Nav receives state of the session from App.js
  const sess = props.state.google_session ? (
    <Container>
      <Menu.Menu position="left">
        <Menu.Item>
          <NavLink to="/">Home</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/profile">Profile</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/demo">Demo</NavLink>
        </Menu.Item>
        <Menu.Item>
          <NavLink to="/tech">Tech</NavLink>
        </Menu.Item>
      </Menu.Menu>
      <Menu.Menu position="right">
        <Menu.Item>
          <h3 className="welcome">Welcome {props.state.name}!</h3>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={logout}>Logout</Button>
        </Menu.Item>
      </Menu.Menu>
    </Container>
  ) : (
    <Container>
      <Menu.Menu position="left">
        <Menu.Item>
          <NavLink to="/">Home</NavLink>
        </Menu.Item>
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

  return <Menu>{sess}</Menu>;
};

export default withRouter(Nav);
