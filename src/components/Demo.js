import React, { useContext } from 'react';
import { Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import StateContext from './StateContext';

const Demo = props => {
  const ctx = useContext(StateContext);

  const demoStatus = async e => {
    const response = await fetch('/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: e.target.value })
    });
    const json = await response.json();

    props.history.push(`/user/${ctx.id}`);
  };

  const updateMock = async e => {
    const response = await fetch('/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: e.target.value })
    });
    const json = await response.json();

    props.history.push(`/user/${ctx.id}`);
  };

  return (
    <div className={'content-demo'}>
      <h1 className="hero">Demo</h1>
      <h2 className="tagline">Make this user experience:</h2>
      <ul>
        <li>
          <Button onClick={demoStatus} value={'good'} color="green">
            Good
          </Button>
        </li>
        <li>
          <Button onClick={demoStatus} value={'bad'} color="yellow">
            Bad
          </Button>
        </li>
        <li>
          <Button onClick={demoStatus} value={'awful'} color="orange">
            Awful
          </Button>
        </li>
        <li>
          <Button onClick={demoStatus} value={'hell'} color="red">
            Hell
          </Button>
        </li>
      </ul>
      <h3>Is the mock user data outdated?</h3>
      <Button size="large" onClick={updateMock} value={'mock'}>
        Update Mock Data
      </Button>
    </div>
  );
};

export default withRouter(Demo);
