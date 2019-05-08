import React, { Component } from 'react';
import { Grid, Container } from 'semantic-ui-react';

class Home extends Component {
  componentDidMount() {}
  render() {
    return (
      <div>
        <Grid textAlign="center" style={{height: "100%" }} verticalAlign="middle">
          <h1 className="hero">Buffering</h1>
          <Container>
          <p className="info ">
            Buffering helps you combat unwanted internet ubiquity  and meet your fitness goals.
Connect to your GoogleFit app, set ambitious goals and, should those goals not be met, witness an absolutely degraded internet experience.
Is this an internet diet? Nope. Browse all the internet you desire. Except you won't want to.
          </p>

          <div >

          <p className="extra-info" >This fitness app & chrome extension combo examines your last 3 days' activityand then reduces your status for each day of subpar performance.
          </p>
          <Grid rows={4} columns={12} className="explanation">
            <Grid.Row>
              <Grid.Column width={4} className="question">Meet all your goals?</Grid.Column>
              <Grid.Column width={8} className="answer">We deem you 'Good'. Feel no guilt that you stayed up watching car crash videos all night. You earned it!
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4} className="question">Miss a day?</Grid.Column>
              <Grid.Column width={8} className="answer">Now your status is 'Bad'. Experience mild annoyance.
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4} className="question">You've slacked off for two whole days?</Grid.Column>
              <Grid.Column width={8} className="answer">Yikes! You're now 'Awful' and that's official according to our database.  Browsing kinda sucks.
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column width={4} className="question">The past three days you've DONE NOTHING?!?</Grid.Column>
              <Grid.Column width={8} className="answer">Congratulations, you're in internet 'Hell'! Yikes doesn't even cut it. Ghosts of the 90s on steroids haunt your computer.
              </Grid.Column>
            </Grid.Row>

          </Grid>
        </div>

          </Container>
        </Grid>
      </div>

    );
  }
}

export default Home;
