import React, { Fragment } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { getString } from './lib/moodle';
import Home from './routes/Home';
import Quiz from './routes/Quiz';
import End from './routes/End';
import AssetsLoader from './components/AssetsLoader';
import { getSpritesUrls } from './components/MrSeed';

const imageAssets = [].concat(getSpritesUrls());

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }

  state = {
    ready: false
  };

  handleGoFullscreen = e => {
    e.preventDefault();
    this.divRef.current.requestFullscreen();
  };

  renderNotReady() {
    return (
      <AssetsLoader
        images={imageAssets}
        onLoad={() => setTimeout(() => this.setState({ ready: true }), 500)}
        render={props => {
          const pc = Math.round(props.ratio * 100);
          return (
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <progress max={100} value={pc}>
                {pc}%
              </progress>
            </div>
          );
        }}
      />
    );
  }

  renderContent() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/quiz" component={Quiz} />
        <Route path="/end" component={End} />
      </Switch>
    );
  }

  render() {
    return (
      <Router>
        <Fragment>
          <div ref={this.divRef} className="mod_readseed-app-wrapper">
            <div className="mod_readseed-app">{this.state.ready ? this.renderContent() : this.renderNotReady()}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="#" onClick={this.handleGoFullscreen}>
              {getString('gofullscreen', 'mod_readseed')}
            </a>
          </div>
        </Fragment>
      </Router>
    );
  }
}
