import React, { Component } from "react";
import moment from "moment-es6";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { Route } from "react-router-dom";

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
  console.log(response);
  console.log("logging out");
};

class Google extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      data: []
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {}

  onReq(res) {
    console.log("onREQ", res);
  }
  fetchData(response) {
    console.log("GOOGLE sending back information...");
    console.log(response);
    let code = { authkey: response.code };
  
    fetch("/login", {
      method: "POST",
      body: JSON.stringify(response),
      headers: {
        "Content-Type": "application/json"
      }
    });

    // fetch(
    //   "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    //   steps
    // )
    //   .then(response => response.json())
    //   .then(data => {
    //     let date = 1555128000000;
    //     let activity = [];
    //     let result = JSON.stringify(data);
    //     console.log(data.bucket);
    //     for (let i = 0; i < data.bucket.length; i++) {
    //       if (data.bucket[i].dataset[0].point[0] !== undefined) {
    //         console.log(
    //           `${name} took ${
    //             data.bucket[i].dataset[0].point[0].value[0].intVal
    //           } steps on ${moment(
    //             parseInt(data.bucket[i].startTimeMillis)
    //           ).calendar()}!`
    //         );
    //         activity.push(
    //           `${name} took ${
    //             data.bucket[i].dataset[0].point[0].value[0].intVal
    //           } steps on ${moment(
    //             parseInt(data.bucket[i].startTimeMillis)
    //           ).calendar()}!`
    //         );
    //         date += 86400000;
    //       }
    //     }

    //     this.setState({ user: user, data: activity });
    //   })
    //   .then(() => {
    //     fetch("/login", {
    //       method: "POST",
    //       body: JSON.stringify(response.code),
    //       headers: {
    //         "Content-Type": "application/json"
    //       }
    //     });
    //   });
  }

  render() {
    console.log(this.data);
    const jerrysteps = this.state.data.map(day => {
      return <p>{day}</p>;
    });
    return (
      <section>
        {jerrysteps}
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
        <GoogleLogout
          clientId={process.env.CLIENT_ID}
          buttonText="Logout"
          onLogoutSuccess={logout}
        />
      </section>
    );
  }
}

export default Google;
