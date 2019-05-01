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
            <Grid.Column>{this.props.state} Name should be here!</Grid.Column>
            <Grid.Column>
              Lorem, ipsum dolor. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis quae corrupti explicabo expedita recusandae consectetur magni ea ducimus
              illo alias? Suscipit quaerat commodi voluptatum cum?
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Widget;
