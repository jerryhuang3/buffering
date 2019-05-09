import React, { Component } from 'react';
import { Grid, Image } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class Tech extends Component {
  render() {
    return (
      <Grid centered columns={3}>
        <Grid.Row>
          <Grid.Column>
            <p className="hero">Stack</p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3}>
            <Image
              className="tech"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png"
            />
          </Grid.Column>
          <Grid.Column width={3}>
            <Image className="tech" src="https://miro.medium.com/max/480/1*To2H39eauxaeYxYMtV1afQ.png" />
          </Grid.Column>
          <Grid.Column width={3}>
            <Image className="tech" src="https://cdn-images-1.medium.com/max/1600/0*g3ns8QALNBBH7CBA." />
          </Grid.Column>
          <Grid.Column width={3}>
            <Image className="tech" src="https://cdn-images-1.medium.com/max/1600/1*3Tp8OGHuIlun20JS84i7DA.gif" />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={3}>
            <Image className="tech" src="https://d1.awsstatic.com/rdsImages/postgresql_logo.6de4615badd99412268bc6aa8fc958a0f403dd41.png" />
          </Grid.Column>
          <Grid.Column width={3}>
            <Image className="tech" src="https://s3-us-west-1.amazonaws.com/codereed/portfolio-images/icons/knex.png" />
          </Grid.Column>
          <Grid.Column width={3}>
            <Image className="tech" src="https://react.semantic-ui.com/logo.png" />
          </Grid.Column>
        </Grid.Row>
        
        <Grid.Row>
          <Grid.Column>
            <p className="hero">Oauth2</p>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={6}>
            <Image style={{ width: '120em'}} src="https://developers.google.com/+/images/server_side_code_flow.png" />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default withRouter(Tech);
