import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getImageUrl } from '../lib/moodle';
import * as seed from '../lib/seed';

class MrSeed extends React.PureComponent {
  static propTypes = {
    mode: PropTypes.oneOf([seed.BLOOM, seed.SLEEPING, seed.WAKE_UP, seed.READY, seed.LISTENING, seed.SMH, seed.THUMBS_UP])
      .isRequired
  };

  render() {
    const tmp = <img src={getImageUrl('pacman', 'mod_readseed')} />;
    let emoji;

    switch (this.props.mode) {
      case seed.BLOOM:
        emoji = '🌻';
        break;
      case seed.SLEEPING:
        emoji = '😴';
        break;
      case seed.WAKE_UP:
        emoji = '🥴';
        break;
      case seed.LISTENING:
        emoji = '🤭';
        break;
      case seed.SMH:
        emoji = '🙄';
        break;
      case seed.THUMBS_UP:
        emoji = '😍';
        break;
      case seed.READY:
      default:
        emoji = '🙂';
        break;
    }

    return (
      <div className="mod_readseed-flex-col mod_readseed-flex-items-center">
        <div style={{ fontSize: '50px', margin: '1em' }}>{emoji}</div>
        <div>
          <small>
            <em>feeling: {this.props.mode}</em>
          </small>
        </div>
      </div>
    );
  }
}

const ConnectedSeed = connect(state => {
  return { mode: state.mrseed.mode, flowerUrl: null };
})(MrSeed);

export default ConnectedSeed;
