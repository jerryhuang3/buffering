import React, { Component } from 'react';
import { Form, Button } from 'semantic-ui-react';

class Goal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  
  onChange = event => {
    this.setState({ value: event.target.value });
  };

  onSubmit = async () => {
    console.log('This submit for goals button registered');
    console.log(`About to update the value to ${this.state.value}`);
    const response = await fetch('/goals/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps: this.state.value, googleId: this.props.profileData.data.google_id })
    });
    const json = await response.json();

    window.location.reload();
    
  };

  render() {
    return (
      <Form size="large">
        <Form.Field className="set_goal">
          <label>Update your goal</label>
          <Form.Input onChange={this.onChange} fluid icon="trophy" iconPosition="left" name="goal" type="number" />
          <Button onClick={this.onSubmit}>Update</Button>
        </Form.Field>
      </Form>
    );
  }
}

export default Goal;
