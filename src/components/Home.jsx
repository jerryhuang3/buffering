import React, { Component } from "react";

class Home extends Component {

  componentDidMount() {
    fetch('/login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

  }
  render() {
    return (
      <div>
        <p>Home</p>
      </div>
    );
  }
}

export default Home;
