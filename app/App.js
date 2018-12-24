import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './routes/Home';
import Quiz from './routes/Quiz';
import End from './routes/End';

export default class App extends React.PureComponent {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/end" component={End} />
        </Switch>
      </Router>
    );
  }
}
