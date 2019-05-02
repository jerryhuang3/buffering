import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import moment from 'moment-es6';

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

  async componentDidMount() {
    const activity = [];
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
  }

  render() {
    if (!this.props.data.session) {
      return <Redirect to="/login" />;
    }
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
