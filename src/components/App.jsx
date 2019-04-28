import React, { Component } from "react";
import Google from './Auth.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div>
        <h1>Daily Step Total</h1> <hr />
        <Google />
      </div>
    );
  }
}

export default App;
