import React, { useState, useEffect, useContext } from 'react';
import { Grid, Form } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import StateContext from './StateContext';

const Initialize = () => {
  const ctx = useContext(StateContext);

  const [id, setId] = useState(null);
  const [stepState, setStepState] = useState(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const response = await fetch('/goals/check', { method: 'POST' });
    const json = await response.json();
    if (json) {
      setId(json);
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
    
    const id = await response.json();
    setId(id);
  };

  if (id) {
    console.log('redirecting to profile', id, typeof id);
    return <Redirect to={`/user/${id}`} />;
  }

  if (!ctx.name) {
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
