import React, { Component } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class Demo extends Component {

  good = async () => {
    const response = await fetch('/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'good' })
    })
    const json = await response.json();
    
    this.props.history.push('/profile')
  }

  bad = async () => {
    const response = await fetch('/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'bad' })
    })
    const json = await response.json();

    this.props.history.push('/profile')
  }

  awful = async () => {
    const response = await fetch('/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'awful' })
    })
    const json = await response.json();

    this.props.history.push('/profile')
  }

  hell = async () => {
    const response = await fetch('/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'hell' })
    })
    const json = await response.json();

    this.props.history.push('/profile')
  }

  render() {
    return (
      <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
        <Grid.Row>
          <Grid.Column>
            <h1 className="hero">Demo</h1>
            <h1 className="tagline">Make this user experience a level:</h1>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Button onClick={this.good} color="green">Good</Button>
        </Grid.Row>
        <Grid.Row>
          <Button onClick={this.bad} color="yellow">Bad</Button>
        </Grid.Row>
        <Grid.Row>
          <Button onClick={this.awful} color="orange">Awful</Button>
        </Grid.Row>
        <Grid.Row>
          <Button onClick={this.hell} color="red">Hell</Button>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(Demo);
