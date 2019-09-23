import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Header, Divider } from 'semantic-ui-react';
import { GoogleLogin } from 'react-google-login';

const Login = props => {
  const authCode = async response => {
    const res = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify(response),
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await res.json();
    if (!json) {
      props.history.push('/400/login');
    }
    login(json.name, json.access_token);
  };

  // Send Login prop to Nav
  const login = (name, access) => {
    console.log(name, login)
    props.login(name, true, access);
  };

  if (props.session) {
    return <Redirect to="/profile" />;
  }
  return (
    <div className="login-form">
      {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
      <style>
        {`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 90%;
      }
    `}
      </style>
      <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="grey" textAlign="center">
            Login to your account
          </Header>
          <Form action="/login" method="POST" size="large">
            <Segment>
              <Form.Input fluid icon="paper plane" iconPosition="left" placeholder="E-mail address" name="email" type="email" />
              <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" name="password" type="password" />
              <Button color="teal" fluid size="large">
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <NavLink to="/signup">Sign up</NavLink>
          </Message>
          <Divider horizontal style={{ color: 'white' }}>
            Signed up using Google?
          </Divider>
          <GoogleLogin
            clientId={process.env.CLIENT_ID}
            scope={process.env.SCOPES}
            buttonText="Login"
            onSuccess={authCode}
            responseType="code"
            accessType="offline"
            cookiePolicy={'single_host_origin'}
            className="login-google-btn">
            Login With Google
          </GoogleLogin>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Login;