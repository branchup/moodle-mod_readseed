import React from 'react';
import PropTypes from 'prop-types';

class TextToSpeech extends React.PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }

  handleRead = e => {
    e.preventDefault();
    const content = this.divRef.current.textContent;
    const message = new SpeechSynthesisUtterance(content);
    window.speechSynthesis.speak(message);
  };

  render() {
    return (
      <div style={{ position: 'relative', display: 'flex' }}>
        <div style={{ display: 'inline-block' }} ref={this.divRef}>
          {this.props.children}
        </div>
        <button href="#" onClick={this.handleRead} style={{ margin: '0 0 0 .5em', alignSelf: 'flex-start' }}>
          🔊
        </button>
      </div>
    );
  }
}

export default TextToSpeech;
