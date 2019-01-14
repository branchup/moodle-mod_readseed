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
    // Disable for now.
    return this.props.children;
    return (
      <div className="mod_readseed-texttospeech">
        <div ref={this.divRef}>{this.props.children}</div>
        <a href="#" onClick={this.handleRead}>
          🔊
        </a>
      </div>
    );
  }
}

export default TextToSpeech;
