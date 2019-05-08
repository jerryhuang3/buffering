import React, { Component } from 'react';
import { Form, Button, Popup, Message } from 'semantic-ui-react';

class Goal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  onChange = event => {
    if (this.state.value < 5000) {
      console.log('you need more!');
    }
    this.setState({ value: event.target.value });
  };

  onSubmit = async () => {
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
    let input;
    if (this.state.value < 5000) {
      input = (<Message error header="Action Forbidden" content="You need to have a goal of at least 5000 steps." />);
    } 
    return (
      <Form size="large">
        <Form.Field className="set_goal">
          <label>Update your goal</label>
          <Form.Input onChange={this.onChange} fluid icon="trophy" iconPosition="left" name="goal" type="number" />
          
          <Popup content="Add users to your feed" trigger={<Button onClick={this.onSubmit}>Update</Button>} />
        </Form.Field>
        <div>{input}</div>
      </Form>
    );
  }
}

export default Goal;
