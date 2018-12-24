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
    return (
      <div>
        <img src={getImageUrl('pacman', 'mod_readseed')} />
        <div>{this.props.mode}</div>
      </div>
    );
  }
}

const ConnectedSeed = connect(state => {
  return { mode: state.mrseed.mode, flowerUrl: null };
})(MrSeed);

export default ConnectedSeed;
