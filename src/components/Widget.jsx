import React, { Component } from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';

class Widget extends Component {
  componentDidMount() {
    this.props.noNav();
  }

  render() {
    return (
      <div>
        <Container textAlign="center">
          <Header as="h2">Buffering</Header>
        </Container>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column />
            <Grid.Column>{this.props.name}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Widget;
