import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Header } from 'semantic-ui-react';
import { GoogleLogin } from 'react-google-login';

class Login extends Component {
  constructor(props) {
    super(props);

    this.authorizationCode = this.authorizationCode.bind(this);
    this.login = this.login.bind(this);
  }

  async authorizationCode(response) {
    console.log("Sending Google's authorization code to the server...");

    const res = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify(response),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json();
    this.login(json.name, json.access_token);
  }

  // Send Login prop to Nav
  login(name, access) {
    console.log('Authentication.jsx: Logging in', name);
    this.props.login(name, true, access);
  }

  render() {
    if (this.props.session) {
      return <Redirect to="/" />;
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
            <Header as="h2" color="white" textAlign="center">
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
              New to us? <NavLink to="/signup">Signup</NavLink>
            </Message>
            <hr/><br/>
            <p>Signed up using Google?</p>
            <GoogleLogin
              clientId={process.env.CLIENT_ID}
              scope={process.env.SCOPES}
              buttonText="Login"
              onSuccess={this.authorizationCode}
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
  }
}

export default Login;
