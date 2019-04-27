import React, { Component } from "react";
import moment from "moment-es6";
import { GoogleLogin } from "react-google-login";

// Options
const CLIENT_ID = "677038605397-j26crueetoelsf8vh5f9pde9l93707r7.apps.googleusercontent.com";
const CLIENT_SECRET = "RF0NkBR0ZB9leQSxpEbWce9y";
const SCOPES = "https://www.googleapis.com/auth/fitness.activity.read";

const steps = {
  method: "POST",
  body: JSON.stringify({
    aggregateBy: [
      {
        dataTypeName: "com.google.step_count.delta",
        dataSourceId:
          "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
      },
    ],
    
    bucketByTime: { durationMillis: 86400000 },
    startTimeMillis: 1555128000000,
    endTimeMillis:   1556325739000
  }),
  headers: {
    "Content-Type": "application/json;encoding=utf-8",
    Host: "fitness.googleapis.com"
  }
};

class Google extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
  }

  fetchData(response) {
    console.log("THIS RUNS");
    console.log(response);
    let name = response.w3.ig;
  
    steps.headers.Authorization = `Bearer ${response.accessToken}`
     
    console.log(response.accessToken);
    fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", steps)
      .then(response => response.json())
      .then(data => {
        let date = 1555128000000;
        let activity = [];
        let result = JSON.stringify(data);
        console.log(data.bucket);
        for (let i=0; i < data.bucket.length; i++) {
          if (data.bucket[i].dataset[0].point[0] !== undefined) {
          console.log(`${name} took ${data.bucket[i].dataset[0].point[0].value[0].intVal} steps on ${moment(parseInt(data.bucket[i].startTimeMillis)).calendar()}!`);
          activity.push(`${name} took ${data.bucket[i].dataset[0].point[0].value[0].intVal} steps on ${moment(parseInt(data.bucket[i].startTimeMillis)).calendar()}!`);
          date += 86400000;
          }
        }

        this.setState({ data: activity });
      });

  }
  
  render() {
    console.log(this.data);
    const jerrysteps = this.state.data.map(day => {
      return (<p>{day}</p>)
    });
    return (
      <section>
        {jerrysteps}
        <GoogleLogin
    clientId="677038605397-j26crueetoelsf8vh5f9pde9l93707r7.apps.googleusercontent.com"
    scope={SCOPES}
    buttonText="Login"
    onSuccess={this.fetchData}
    cookiePolicy={'single_host_origin'}
  />
      </section>
    );
  }
}

export default Google;
