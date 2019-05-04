import React, { Component } from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';
import moment from 'moment';

class Widget extends Component {
  componentDidMount() {
    this.props.noNav();
  }

  render() {
    const time = moment().format('MMMM Do YYYY');
    return (
      <div>
        <Container textAlign="center">
          <Header as="h2">Buffering</Header>
        </Container>
        <Grid divided="vertically">
          <Grid.Row columns={2}>
            <Grid.Column>{time}</Grid.Column>
            <Grid.Column>{this.props.data.name}</Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Widget;
