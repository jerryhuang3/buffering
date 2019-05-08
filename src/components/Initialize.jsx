import React, { Component } from 'react';
import { Grid, Form } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

class Initialize extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
      success: false
    };
  }

  async componentDidMount() {
    const response = await fetch('/goals/check', { method: 'POST' });
    const json = await response.json();

    if (json) {
      this.setState({success: json});
    }
  }

  onChange = event => {
    this.setState({ value: event.target.value });
  };

  onSubmit = async () => {
    const response = await fetch('/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps: this.state.value })
    });
    const json = await response.json();
    this.setState({success: json});
  };

  redirect = () => {
    if (this.state.success) {
      return <Redirect to='/profile' />
    }
  }
  render() {
    return (
      <Grid centered>
        <Grid.Column width={9}>
        {this.redirect()}
          <Form size="large">
            <Form.Field className="set_goal">
              <label>Set your goal:</label>
              <Form.Input onChange={this.onChange} fluid icon="trophy" iconPosition="left" name="goal" type="number" />
              <button onClick={this.onSubmit}>Update</button>
            </Form.Field>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Initialize;
