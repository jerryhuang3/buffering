import React from 'react';
import { Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

const Demo = props => {
  const onClick = async e => {
    const response = await fetch('/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: e.target.value })
    });
    const json = await response.json();

    props.history.push('/profile');
  };

  return (
    <div className={'content-demo'}>
      <h1 className="hero">Demo</h1>
      <h2 className="tagline">Make this user experience:</h2>
      <ul>
        <li>
          <Button onClick={onClick} value={'good'} color="green">
            Good
          </Button>
        </li>
        <li>
          <Button onClick={onClick} value={'bad'} color="yellow">
            Bad
          </Button>
        </li>
        <li>
          <Button onClick={onClick} value={'awful'} color="orange">
            Awful
          </Button>
        </li>
        <li>
          <Button onClick={onClick} value={'hell'} color="red">
            Hell
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default withRouter(Demo);
