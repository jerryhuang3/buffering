import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import StateContext from '../StateContext';

const Goal = () => {
  const context = useContext(StateContext);

  const [newGoal, setNewGoal] = useState('');
  const [didUpdate, setDidUpdate] = useState(true);

  const onChange = event => {
    setNewGoal(event.target.value);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const response = await fetch('/goals/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps: newGoal })
    });
    const json = await response.json();
    if (json) {
      setDidUpdate(true);
      context.setGoalUpdate(json);
    } else {
      setDidUpdate(false);
    }
    setNewGoal('');
  };

  return (
    <div className={'set_goal'}>
      <Form onSubmit={handleSubmit} size="large">
        <Form.Field>
          <label>Update your goal</label>
          <Form.Input onChange={onChange} value={newGoal} fluid icon="trophy" iconPosition="left" name="goal" type="number" />
          {didUpdate ? <Button onSubmit={handleSubmit}>Update</Button> : <p>You can only update once a day!</p>}
        </Form.Field>
      </Form>
    </div>
  );
};

export default Goal;
