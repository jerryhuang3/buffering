import React, { useContext, useState } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Divider } from 'semantic-ui-react';
import { GoogleLogin } from 'react-google-login';
import StateContext from './StateContext';

const Login = props => {
  const ctx = useContext(StateContext);

  const [input, setInput] = useState({ email: "test@test.com", password: "test"});

  const handleChange = e => {
    e.persist();
    setInput(inputs => ({ ...inputs, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleLogin(input);
  };

  const handleLogin = async response => {
    console.log(response)
    const res = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify(response),
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await res.json();
    if (!json) {
      props.history.push('/400/login');
    } else {
      ctx.setId(json.id);
      ctx.setName(json.name);
      ctx.setAccessToken(json.access_token);
      props.history.push(`/user/${json.id}`);
    }
  };

  if (ctx.name) {
    return <Redirect to={`/user/${ctx.id}`} />;
  }
  return (
    <div className={'content-account'}>
      <div className={'login-form'}>
        <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
          <Grid.Column style={{ maxWidth: 450 }}>
            <h2>Login to your account</h2>
            <Form onSubmit={handleSubmit} size="large">
              <Segment>
                <Form.Input
                  onChange={handleChange}
                  fluid
                  icon="paper plane"
                  iconPosition="left"
                  placeholder="E-mail address"
                  value={input.email}
                  name="email"
                  type="email"
                />
                <Form.Input
                  onChange={handleChange}
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  value={input.password}
                  name="password"
                  type="password"
                />
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
              onSuccess={handleLogin}
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
