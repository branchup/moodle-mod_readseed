import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const SpeechBubble = props => (
  <div className={`mod_readseed-speech-bubble ${props.size ? `size-${props.size}` : ''}`}>
    <div className="mod_readseed-speech-bubble-content">{props.text}</div>
  </div>
);

SpeechBubble.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['medium'])
};

export default SpeechBubble;
