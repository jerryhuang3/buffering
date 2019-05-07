import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

class Home extends Component {
  componentDidMount() {}
  render() {
    return (
      <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
        <Grid.Column>
          <h1 className="hero">Buffering</h1>
          <h2 className="info">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate nobis repellendus dolore nostrum ut quaerat nihil laudantium
            officiis tempore at.
          </h2>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Home;
