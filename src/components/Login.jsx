import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Header, Modal } from 'semantic-ui-react';
import { GoogleLogin } from 'react-google-login';

class Login extends Component {
  constructor(props) {
    super(props);

    this.authorizationCode = this.authorizationCode.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  authorizationCode(response) {
    console.log("Sending Google's authorization code to the server...");
    console.log(response);
    fetch('/login', {
      method: 'POST',
      body: JSON.stringify(response),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(promise => {
        return promise.json();
      })
      .then(userName => {
        console.log(userName);
        this.login(userName.name, userName.access_token);
      });
  }

  // Send Login prop to Nav
  login(name, access) {
    console.log('Authentication.jsx: Logging in', name);
    this.props.login(name, true, access);
  }

  // Send Logout prop to Nav
  logout() {
    console.log('Authentication.jsx: Logging out');
    fetch('/logout', { method: 'POST' });
    this.props.logout(null, false, null);
  }

  render() {
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
            <Header as="h2" color="teal" textAlign="center">
              Log in to your account
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input fluid icon="user" iconPosition="left" placeholder="E-mail address" />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />

                <Button color="teal" fluid size="large">
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <NavLink to="/Signup">Sign up</NavLink>
            </Message>
            <GoogleLogin
              clientId={process.env.CLIENT_ID}
              scope="https://www.googleapis.com/auth/fitness.activity.read"
              buttonText="Login"
              onSuccess={this.authorizationCode}
              responseType="code"
              accessType="offline"
              cookiePolicy={'single_host_origin'}
              className='login-google-btn'>
              Login With Google
            </GoogleLogin>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Login;
