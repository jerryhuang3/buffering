import React, { Component } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

class Authentication extends Component {
  constructor(props) {
    super(props);

    this.authorizationCode = this.authorizationCode.bind(this);
    // this.userInfo = this.userInfo.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  authorizationCode(response) {
    console.log("Sending Google's authorization code to the server...");
    console.log(response);
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(response),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(promise => {
        return promise.json();
      })
      .then(userName => {
        console.log(userName);
        this.login(userName.name);
      });
  }

  // Send Login prop to Nav
  login(name) {
    console.log('Authentication.jsx: Logging in', name);
    this.props.login(name, true);
  }

  // Send Logout prop to Nav
  logout() {
    console.log('Authentication.jsx: Logging out');
    fetch('/logout', { method: 'POST' });
    this.props.logout(false);
  }

  render() {
    // Authentication receives session prop from Nav
    const button = this.props.session ? (
      <GoogleLogout
        clientId={process.env.CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={this.logout}
      />
    ) : (
      <GoogleLogin
        clientId={process.env.CLIENT_ID}
        scope="https://www.googleapis.com/auth/fitness.activity.read"
        buttonText="Login"
        onSuccess={this.authorizationCode}
        responseType="code"
        cookiePolicy={'single_host_origin'}
      />
    );
      
    return <section>{button}</section>;
  }
}

export default Authentication;
