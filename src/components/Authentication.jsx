import React, { Component } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import Cookies from "universal-cookie";

class Authentication extends Component {
  constructor(props) {
    super(props);

    this.AuthorizationCode = this.AuthorizationCode.bind(this);
    this.fetchToken = this.fetchToken.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  AuthorizationCode(response) {
    console.log("Sending Google's authorization code to the server...");
    console.log(response);
    fetch("/login", {
      method: "POST",
      body: JSON.stringify(response),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        console.log("RESPONSE", response);
        this.fetchToken(response);
      })
      .then(res => console.log(res));
    this.login();
  }

  fetchToken(response) {
    console.log("Fetching token from backend");
    
    // server fetch --v
    // fetch("/login/test_fetch")
    // test routes fetch --v
  }

  // Send Login prop to Nav
  login() {
    console.log("Authentication.jsx: Logging in");
    this.props.login(true);
    // const cookies = new Cookies();

    // cookies.set("myCat", "Pacman", { path: "/" });
    // console.log(cookies.get("myCat")); // Pacman
  }

  // Send Logout prop to Nav
  logout() {
    console.log("Authentication.jsx: Logging out");
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
        onSuccess={this.AuthorizationCode}
        responseType="code"
        cookiePolicy={"single_host_origin"}
      />
    );

    return <section>{button}</section>;
  }
}

export default Authentication;
