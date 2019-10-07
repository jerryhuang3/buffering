import React from 'react';
import { Grid, Container } from 'semantic-ui-react';

const Home = () => {
  return (
    <div className={'content-home'}>
      <Grid>
        <Container>
          <h1 className="hero">What is buffering?</h1>
          <p className="info ">
            Buffering helps you combat unwanted internet ubiquity and meet your fitness goals. Connect to your GoogleFit app, set ambitious
            goals and, should those goals not be met, witness an absolutely degraded internet experience. Is this an internet diet? Nope.
            Browse all the internet you desire. Except you won't want to.
          </p>

          <div>
            <p className="extra-info">
              This fitness app & chrome extension combo examines your last 7 days' activity and then reduces your status for each day of
              subpar performance.
            </p>

            <div className="description">
              <div className="q-n-a">
                <span className="question">MEET ALL YOUR GOALS?</span>
                <span className="answer">
                  We deem you <span className="status">'Good'</span>. Feel no guilt that you stayed up watching car crash videos all night.
                  You earned it!
                </span>
              </div>

              <div className="q-n-a">
                <span className="question">MISS A DAY?</span>
                <span className="answer">
                  Now your status is <span className="status">'Bad'</span>. Experience mild annoyance.
                </span>
              </div>

              <div className="q-n-a">
                <span className="question">SLACKED OFF FOR TWO WHOLE DAYS?</span>
                <span className="answer">
                  Yikes! You're now <span className="status">'Awful'</span> and that's official according to our database. Browsing kinda
                  sucks.
                </span>
              </div>

              <div className="q-n-a">
                <span className="question">YOU'VE DONE NOTHING FOR THREE DAYS?!?</span>
                <span className="answer">
                  Congratulations, you're in internet <span className="status">'Hell'</span>! Yikes doesn't even cut it. Ghosts of the 90s
                  on steroids haunt your computer.
                </span>
              </div>
            </div>
          </div>
        </Container>
      </Grid>
    </div>
  );
};

export default Home;
