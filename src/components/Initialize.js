import React, { useState, useEffect } from 'react';
import { Grid, Form } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

const Initialize = props => {
  const [state, setState] = useState({ value: null, success: false });

  useEffect(() => {
    const fetchGoals = async () => {
      const response = await fetch('/goals/check', { method: 'POST' });
      const json = await response.json();

      if (json) {
        setState({ success: json });
      }
    };

    fetchGoals();
  }, []);

  const onChange = event => {
    setState({ value: event.target.value });
  };

  const onSubmit = async () => {
    const response = await fetch('/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps: state.value })
    });
    const json = await response.json();
    setState({ success: json });
  };

  const redirect = () => {
    if (state.success) {
      return <Redirect to="/profile" />;
    }
  };

  return (
    <Grid centered>
      <Grid.Column width={9}>
        {redirect()}
        <Form size="large">
          <Form.Field className="set_goal">
            <label>Set your goal:</label>
            <Form.Input onChange={onChange} fluid icon="trophy" iconPosition="left" name="goal" type="number" />
            <button onClick={onSubmit}>Update</button>
          </Form.Field>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Initialize;