import React, { Component } from "react";

class Home extends Component {
  render() {
    console.log(document.cookie);
    return (
      <div>
        <p>Home</p>
      </div>
    );
  }
}

export default Home;
