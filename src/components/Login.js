import React, { useContext } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Header, Divider } from 'semantic-ui-react';
import { GoogleLogin } from 'react-google-login';
import StateContext from './StateContext';

const Login = props => {
  const context = useContext(StateContext);

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
    context.setName(json.name);
    context.setGoogleSession(true);
    context.setAccessToken(json.access_token);
    context.setPicture(json.picture);
  };

  if (context.google_session) {
    return <Redirect to="/profile" />;
  }
  return (
    <div className={'content-account'}>
      <div className={'login-form'}>
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <h2>
              Login to your account
            </h2>
            <Form action="/login" method="POST" size="large">
              <Segment>
                <Form.Input fluid icon="paper plane" iconPosition="left" placeholder="E-mail address" name="email" type="email" />
                <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" name="password" type="password" />
                <Button color="black" fluid size="large">
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
    </div>
  );
};

export default Login;
