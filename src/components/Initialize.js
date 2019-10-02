import React, { useState, useEffect, useContext } from 'react';
import { Grid, Form } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import StateContext from './StateContext';

const Initialize = () => {
  const context = useContext(StateContext);

  const [success, setSuccess] = useState(false);
  const [stepState, setStepState] = useState(null);

  useEffect(() => {
      fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const response = await fetch('/goals/check', { method: 'POST' });
    const json = await response.json();
    if (json) {
      setState({ success: json });
    }
  };

  const onChange = event => {
    setStepState(event.target.value);
  };

  const onSubmit = async () => {
    const response = await fetch('/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps: stepState })
    });
    const json = await response.json();
    setSuccess(json);
  };

 
    if (success) {
      return <Redirect to="/profile" />;
    }

  if (!context.name) {
    return <Redirect to="/login" />;
  }

  return (
    <div className={'content-initialize'}>
      <Grid centered>
        <Grid.Column width={9}>
          <Form size="large">
            <Form.Field className="init-goal">
              <label>Set your goal:</label>
              <Form.Input onChange={onChange} fluid icon="trophy" iconPosition="left" name="goal" type="number" />
              <button onClick={onSubmit}>Update</button>
            </Form.Field>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Initialize;
