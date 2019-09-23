import React, { useEffect, useContext } from 'react';
import { Container, Header, Grid } from 'semantic-ui-react';
import StateProvider from './StateProvider';
import moment from 'moment';

const Widget = props => {
  const context = useContext(StateProvider);

  useEffect(() => {
    context.setNav(false);
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
          <Grid.Column>{context.name}</Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Widget;
