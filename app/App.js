import React, { Fragment } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import { getString } from './lib/moodle';
import Home from './routes/Home';
import Quiz from './routes/Quiz';
import End from './routes/End';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }

  handleGoFullscreen = e => {
    e.preventDefault();
    this.divRef.current.requestFullscreen();
  };

  render() {
    return (
      <Router>
        <Fragment>
          <div ref={this.divRef} className="mod_readseed-app-wrapper">
            <div className="mod_readseed-app">
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/quiz" component={Quiz} />
                <Route path="/end" component={End} />
              </Switch>
            </div>
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
