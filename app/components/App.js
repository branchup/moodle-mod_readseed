import React from 'react';
import Recorder from './Recorder';

export default class App extends React.PureComponent {
  render() {
    return (
      <div>
        Hello world!
        <Recorder />
      </div>
    );
  }
}
