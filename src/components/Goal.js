import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';
import StateContext from './StateContext';

const Goal = () => {
  const context = useContext(StateContext);

  const [newGoal, setNewGoal] = useState(null);
  const [didUpdate, setDidUpdate] = useState(true);
  
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
      setDidUpdate(true);
      context.setGoalUpdate(json);
    } else {
      setDidUpdate(false);
    }
  };

  return (
    <div className={'set_goal'}>
      <Form size="large">
        <Form.Field>
          <label>Update your goal</label>
          <Form.Input onChange={onChange} fluid icon="trophy" iconPosition="left" name="goal" type="number" />
          {didUpdate ? <Button onClick={onClick}>Update</Button> : <p>You can only update once a day!</p>}
        </Form.Field>
      </Form>
    </div>
  );
};

export default Goal;
