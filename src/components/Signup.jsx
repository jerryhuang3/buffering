import React, { Component } from 'react';
import { NavLink, Redirect, withRouter } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Header } from 'semantic-ui-react';
import { GoogleLogin } from 'react-google-login';

class Signup extends Component {
  constructor(props) {
    super(props);
  }

  authCode = async(response) => {
    console.log("Sending Google's authorization code to the server...");

    const res = await fetch('/signup', {
      method: 'POST',
      body: JSON.stringify(response),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const json = await res.json();
    if (!json) {
      this.props.history.push('/400/signup');
    }
    this.signup(json.name, json.access_token);
  }

  // Send Signup prop to Nav
  signup = (name, access) => {
    console.log('Signup.jsx: Signed up', name);
    this.props.history.push('/initialize')
    this.props.signup(name, true, access);
  }

  render() {
    if (this.props.google_session) {
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
            <Header as="h2" color="white" textAlign="center">
              Create a new account
            </Header>
            <Form action="/signup" method="POST" size="large">
              <Segment>
                <Form.Input fluid icon="user" iconPosition="left" placeholder="Full Name" name="name" />
                <Form.Input fluid icon="paper plane" iconPosition="left" placeholder="E-mail address" name="email" type="email" />
                <Form.Input fluid icon="lock" iconPosition="left" placeholder="Password" name="password" type="password" required />
                <Button color="teal" fluid size="large">
                  Signup
                </Button>
              </Segment>
            </Form>
            <Message>
              Already have an account? <NavLink to="/login">Login</NavLink>
            </Message>
            <hr/><br/>
            <GoogleLogin
              clientId={process.env.CLIENT_ID}
              scope={process.env.SCOPES}
              buttonText="Login"
              onSuccess={this.authCode}
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
    );
  }
}
export default withRouter(Signup);
