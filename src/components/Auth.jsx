import React, { Component } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

require("dotenv").config();

// Options
const CLIENT_ID =
  "677038605397-j26crueetoelsf8vh5f9pde9l93707r7.apps.googleusercontent.com";
const CLIENT_SECRET = "RF0NkBR0ZB9leQSxpEbWce9y";
const SCOPES = "https://www.googleapis.com/auth/fitness.activity.read";

const steps = {
  method: "POST",
  body: JSON.stringify({
    aggregateBy: [
      {
        dataTypeName: "com.google.step_count.delta",
        dataSourceId:
          "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
      }
    ],

    bucketByTime: { durationMillis: 86400000 },
    startTimeMillis: 1555128000000,
    endTimeMillis: 1556325739000
  }),
  headers: {
    "Content-Type": "application/json;encoding=utf-8",
    Host: "www.googleapis.com"
  }
};

const logout = response => {
  console.log("logging out");
};

class Google extends Component {
  constructor(props) {
    super(props);

    this.state = {
      session: false
    };
    this.fetchData = this.fetchData.bind(this);
    this.fetchToken = this.fetchToken.bind(this);
    console.log("rendered google component");
  }

  componentDidMount() {
    
  }

  // Send Google's Authorization code to server
  fetchData(response) {
    console.log("Sending Google's response back information to the server...");
    console.log(response);
    let code = { authkey: response.code };
    fetch("/login", {
      method: "POST",
      body: JSON.stringify(response),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then( () => {
      this.fetchToken();
    });
    // Run function

  }

  fetchToken(response) {
    console.log("Fetching token from backend");
    // server fetch --v
    // fetch("/login/test_fetch")
    // test routes fetch --v
    fetch("http://localhost:3000/test/login")
    .then( (res, err) => {
      console.log(res);
    })
  }

  render() {
    const session = this.state.session ? (
      <GoogleLogout
        clientId={process.env.CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={logout}
      />
    ) : (
      <GoogleLogin
        clientId={process.env.CLIENT_ID}
        scope={SCOPES}
        buttonText="Login"
        onSuccess={this.fetchData}
        onRequest={this.onReq}
        responseType="code"
        accessType="offline"
        approvalPrompt="force"
        cookiePolicy={"single_host_origin"}
      />
    )
    if (this.state.session === true) {
      return <Redirect to="/profile" />
    }
    return (
      <section>
        <br/><br />
        <div style={{ border: '2px solid black', width: '100px'}}>{session}</div>
      </section>
    );
  }
}

export default Google;
