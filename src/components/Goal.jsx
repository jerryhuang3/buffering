import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';

const Goal = props => {

  const [state, setState] = useState({value: null})

  const onChange = event => {
    setState({ value: event.target.value });
  };

  const onClick = async() => {
    console.log('running normally');
    const response = await fetch('/goals/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ steps: state.value, googleId: props.profileData.data.google_id })
    });
    const json = await response.json();

    window.location.reload();
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
  
}

export default Goal;
