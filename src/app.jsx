import React, { Component } from "react";
import moment from "moment-es6";

const steps = {
  method: "POST",
  body: JSON.stringify({
    aggregateBy: [
      {
        dataTypeName: "com.google.step_count",
        dataSourceId:
          "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
      },
    ],
    
    bucketByTime: { durationMillis: 86400000 },
    startTimeMillis: 1555128000000,
    endTimeMillis:   1556228800000
  }),
  headers: {
    "Content-Type": "application/json;encoding=utf-8",
    Host: "www.googleapis.com",
    "Content-length": 296,
    Authorization:
      "Bearer ya29.Glv2Bh1rvodtRGlZtNQ0BAb6KymEqhM3VB_0XRZ49OVuymz0DNH9e5AQnCjlu1HN7e0hib2NgnrPNBc9udlqSe0jBUq_vSZNNa30MXxgOT4nc4d1sNflG_CuEvNt"
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", steps)
      .then(response => response.json())
      .then(data => {
        let result = JSON.stringify(data);
        let steps = [];
        steps.push(data.bucket);
        console.log(steps);
        console.log(data.bucket[0].dataset[0].point[0].value[0].intVal);
        this.setState({ data: steps });
      });
  }

  render() {
    console.log(this.state.data)
    return (
      <div>
        <h1>Daily Step Total</h1> <hr />
        <h3>{moment(1555128000000).calendar()}</h3>
      </div>
    );
  }
}

export default App
