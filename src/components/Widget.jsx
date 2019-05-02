import React, { Component } from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';

class Widget extends Component {
  componentDidMount() {
    this.props.noNav();
  }

  render() {
    console.log('We should see some activity here: ', this.props.activity);
    return (
      <div>
        <Container textAlign="center">
          <Header as="h2">Buffering</Header>
        </Container>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque, illo?
            </Grid.Column>
            <Grid.Column>{this.props.name}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Widget;
