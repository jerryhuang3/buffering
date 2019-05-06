import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

class Home extends Component {
  componentDidMount() {}
  render() {
    return (
      <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
        <Grid.Column>
          <h1 className="hero">Buff_r_ng</h1>
          <h1 className="tagline">Plz end my suffering</h1>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Home;
