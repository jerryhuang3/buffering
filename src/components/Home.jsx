import React, { Component } from 'react';
import { Grid, Message, Segment, Header } from 'semantic-ui-react';

class Home extends Component {
  componentDidMount() {}
  render() {
    return (
      <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
        <Grid.Column>
          <h1 className="hero">Buffering</h1>
          <h3 className="tagline">Plz end my suffering</h3>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Home;
