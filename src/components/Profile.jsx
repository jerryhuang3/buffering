import React, { Component } from 'react';
import moment from 'moment';

const steps = {
  method: 'POST',
  body: JSON.stringify({
    aggregateBy: [
      {
        dataTypeName: 'com.google.step_count.delta',
        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
      }
    ],

    bucketByTime: { durationMillis: 86400000 },
    startTimeMillis: 1554868800000,
    endTimeMillis: Date.now()
  }),
  headers: {
    token_type: "Bearer",
    'Content-Type': 'application/json;encoding=utf-8',
    Host: 'www.googleapis.com'
  }
};

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activity: []
    }
  }

  componentDidMount() {
    console.log('THIS RUNS');
    const activityHistory = { steps: [], goals: [] };
    const name = this.props.data.name;
    steps.headers.Authorization = `Bearer ${this.props.data.access_token}`;


    fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', steps)
      .then(response => response.json())
      .then(data => {
        console.log(data.bucket);
        for (let i = 0; i < data.bucket.length; i++) {
          if (data.bucket[i].dataset[0].point[0] !== undefined) {

            activity.push(
              `${name} took ${data.bucket[i].dataset[0].point[0].value[0].intVal} steps on ${moment(
                parseInt(data.bucket[i].startTimeMillis)
              ).calendar()}!`
            );
          }
        }
        this.setState({activity});
      });

    // assemble steps + goals

  }

  render() {
    console.log(this.state);
    const steps = this.state.activity.map(day => {
      return <p>{day}</p>;
    });
    return (
      <div>
        {steps}
      </div>
    );
  }
}

export default Profile;
