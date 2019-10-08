import React, { useState, useContext } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import StateContext from './StateContext';

const Nav = () => {
  const ctx = useContext(StateContext);

  const [nav, showNav] = useState(false);

  const onClick = e => {
    if (!nav) {
      document.getElementsByClassName('nav-left')[0].style.display = 'block';
    } else {
      document.getElementsByClassName('nav-left')[0].style.display = 'none';
    }
    showNav(!nav);
  };

  const logout = async () => {
    const res = await fetch('/logout', { method: 'POST' });
    const logout = await res.json();

    let auth2 = gapi.auth2.getAuthInstance();
    // Sign out of Google on local website
    auth2.signOut().then(() => auth2.disconnect());

    if (logout) {
      ctx.setAccessToken(null);
      ctx.setName(null);
      ctx.setPicture(null);
    }
  };
  // Nav receives state of the session from App.js
  const session = ctx.name ? (
    <div className={'nav'}>
      <div className={'burger'} onClick={onClick}>
        <a>
          <i className={'fas fa-bars fa-2x'} />
        </a>
      </div>
      <div className={'nav-left'}>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to={`/user/${ctx.id}`}>Profile</NavLink>
          </li>
          <li>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
          </li>
          <li>
            <NavLink to="/demo">Demo</NavLink>
          </li>
          <li onClick={logout}>
            <NavLink to="/">Logout</NavLink>
          </li>
        </ul>
      </div>
      <div className={'nav-middle'}>
        <h2>Buffering</h2>
      </div>
      <div className={'nav-right'}>
        <h4>Welcome {ctx.name}!</h4>
      </div>
    </div>
  ) : (
    <div className={'nav'}>
      <div className={'burger'} onClick={onClick}>
        <a>
          <i className={'fas fa-bars fa-2x'} />
        </a>
      </div>
      <div className={'nav-left'}>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/signup">Signup</NavLink>
          </li>
        </ul>
      </div>
      <div className={'nav-middle'}>
        <h2>Buffering</h2>
      </div>
    </div>
  );

  return <div className={'nav2-container'}>{session}</div>;
};

export default withRouter(Nav);
