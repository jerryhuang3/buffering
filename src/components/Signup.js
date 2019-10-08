import React, { useState, useContext } from 'react';
import { NavLink, Redirect, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react';
import { GoogleLogin } from 'react-google-login';
import StateContext from './StateContext';

const Signup = props => {
  const ctx = useContext(StateContext);

  const [input, setInput] = useState({});

  const handleChange = e => {
    e.persist();
    setInput(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleSignup(input);
  };

  const handleSignup = async response => {
    const res = await fetch('/signup', {
      method: 'POST',
      body: JSON.stringify(response),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json();

    if (!json) {
      props.history.push('/400/signup');
    } else {
      ctx.setId(json.id);
      ctx.setName(json.name);
      ctx.setAccessToken(json.access_token);
      props.history.push('/initialize');
    }
  };

  if (ctx.name) {
    return <Redirect to="/profile" />;
  }
  return (
    <div className={'content-account'}>
      <div className="login-form">
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <h2>Create a new account</h2>
            <Form onSubmit={handleSubmit} size="large">
              <Segment>
                <Form.Input onChange={handleChange} fluid icon="user" iconPosition="left" placeholder="Full Name" name="name" />
                <Form.Input
                  onChange={handleChange}
                  fluid
                  icon="paper plane"
                  iconPosition="left"
                  placeholder="E-mail address"
                  name="email"
                  type="email"
                />
                <Form.Input
                  onChange={handleChange}
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  name="password"
                  type="password"
                  required
                />
                <Button color="black" fluid size="large">
                  Sign up
                </Button>
              </Segment>
            </Form>
            <Message>
              Already have an account? <NavLink to="/login">Login</NavLink>
            </Message>
            <hr />

            <GoogleLogin
              clientId={process.env.CLIENT_ID}
              scope={process.env.SCOPES}
              buttonText="Login"
              onSuccess={handleSignup}
              responseType="code"
              accessType="offline"
              prompt="consent"
              cookiePolicy={'single_host_origin'}
              className="login-google-btn">
              Sign up with Google
            </GoogleLogin>
          </Grid.Column>
        </Grid>
      </div>
    </div>
  );
};

export default withRouter(Signup);
