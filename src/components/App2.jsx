import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Redirect,
    withRouter
} from 'react-router-dom';

function App(){
    return (
        <Router>
            <AuthButton />
            <div>
                <h1>Welcome</h1>
                <Link to="/login"> Log In</Link> |
                <Link to="/signup"> Sign Up</Link> |
                <Link to="/profile"> Profile</Link> |
                <Link to="/setgoals"> Set Goals</Link> |
            </div>
            <Route path="/login" component={Login}/>
            <Route path="/signup" component={SignUp}/>
            <PrivateRoute path="/profile" component={Profile}/>
            <PrivateRoute path="/setgoals" component={SetGoals}/>
        </Router>
    )
}

const fakeAuth = {
    isAuthenticated: false,
    authenticate (callback) {
        this.isAuthenticated = true;
        setTimeout(callback, 250);
    },
    signout(callback) {
        this.isAuthenticated = false;
        setTimeout(callback, 250);
    }
};

const AuthButton = withRouter(
    ({ history }) =>
      fakeAuth.isAuthenticated ? (
        <p>
          Welcome!{" "}
          <button
            onClick={() => {
              fakeAuth.signout(() => history.push("/"));
            }}
          >
            Sign out
          </button>
        </p>
      ) : (
        <p>You are not logged in.</p>
      )
  );


function SignUp(){
    return <h3>Signed Up</h3>
}

function Profile(){
    return <h3>Profile</h3>
}

function SetGoals(){
    return <h3>Set Goals</h3>
}

function PrivateRoute({ component: Component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          fakeAuth.isAuthenticated ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

class Login extends Component {
    state = { redirectToReferrer: false };

    login = () => {
      fakeAuth.authenticate(() => {
        this.setState({ redirectToReferrer: true });
      });
    };

    render() {
      let { from } = this.props.location.state || { from: { pathname: "/" } };
      let { redirectToReferrer } = this.state;

      if (redirectToReferrer) return <Redirect to={from} />;

      return (
        <div>
          <form>
          <p>You must log in to view the page at {from.pathname}</p>
          <button onClick={this.login}>Log in</button>
          </form>
        </div>
      );
    }
  }


export default App;