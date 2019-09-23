import React, { useEffect } from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';
import moment from 'moment';

const Widget = props => {
  useEffect(() => {
    props.noNav();
  }, []);

  const time = moment().format('MMMM Do YYYY');
  return (
    <div>
      <Container textAlign="center">
        <Header as="h2">Buffering</Header>
      </Container>
      <Grid divided="vertically">
        <Grid.Row columns={2}>
          <Grid.Column>{time}</Grid.Column>
          <Grid.Column>{props.data.name}</Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Widget;
