import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import StateContext from './StateContext';

const Goal = () => {
  const context = useContext(StateContext);

  const [newGoal, setNewGoal] = useState(null);

  const onChange = event => {
    setNewGoal(event.target.value);
  };

  const onClick = async () => {
    const response = await fetch('/goals/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps: newGoal })
    });
    const json = await response.json();
    if (json) {
      context.setGoalUpdate(json);
    }
  };

  return (
    <Form size="large">
      <Form.Field className="set_goal">
        <label>Update your goal</label>
        <Form.Input onChange={onChange} fluid icon="trophy" iconPosition="left" name="goal" type="number" />
        <Button onClick={onClick}>Update</Button>
      </Form.Field>
    </Form>
  );
};

export default Goal;
