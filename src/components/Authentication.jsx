import React, { Component } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

class Authentication extends Component {
  constructor(props) {
    super(props);

    this.fetchData = this.fetchData.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  fetchData(response) {
    console.log("Sending Google's response back information to the server...");
    console.log(response);
    fetch("/login", {
      method: "POST",
      body: JSON.stringify(response),
      headers: {
        "Content-Type": "application/json"
      }
    });
    this.login();
  }

  fetchToken(response) {
    console.log("Fetching token from backend");
    console.log(document.cookie);
    // server fetch --v
    // fetch("/login/test_fetch")
    // test routes fetch --v
    fetch("http://localhost:3000/test/login").then((res, err) => {
      console.log(res);
    });
  }

  // Send Login prop to Nav
  login() {
    console.log("Authentication.jsx: Logging in");
    this.props.login(true);
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
        onSuccess={this.fetchData}
        responseType="code"
        cookiePolicy={"single_host_origin"}
      />
    );

    return <section>{button}</section>;
  }
}

export default Authentication;
