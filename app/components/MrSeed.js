import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AnimatedSprites from './AnimatedSprites';
import { makeMrSeedReady } from '../state/actions';
import { getImageUrl } from '../lib/moodle';
import * as seed from '../lib/seed';

const bloomUrl = getImageUrl('sprites/bloom', 'mod_readseed');
const idleUrl = getImageUrl('sprites/idle', 'mod_readseed');
const sleepingUrl = getImageUrl('sprites/sleeping', 'mod_readseed');
const smhUrl = getImageUrl('sprites/smh', 'mod_readseed');
const thumbsUpUrl = getImageUrl('sprites/thumbsup', 'mod_readseed');
const yawnUrl = getImageUrl('sprites/yawn', 'mod_readseed');

export function getSpritesUrls() {
  return [bloomUrl, idleUrl, sleepingUrl, smhUrl, thumbsUpUrl, yawnUrl];
}

class MrSeed extends React.PureComponent {
  static propTypes = {
    mode: PropTypes.oneOf([seed.BLOOM, seed.SLEEPING, seed.WAKE_UP, seed.READY, seed.LISTENING, seed.SMH, seed.THUMBS_UP])
      .isRequired,
    width: PropTypes.number,
    height: PropTypes.height
  };

  renderEmoji() {
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
    return <div style={{ fontSize: '50px', margin: '1em' }}>{emoji}</div>;
  }

  renderSprite() {
    const spriteWidth = 688;
    const spriteHeight = 645;
    const desiredWidth = this.props.width || spriteWidth;
    const desiredHeight = this.props.height || spriteHeight;

    const widthRatio = desiredWidth / spriteWidth;
    const heightRatio = desiredHeight / spriteHeight;

    let displayWidth;
    let displayHeight;

    if (widthRatio < heightRatio) {
      // The width is smaller.
      displayWidth = desiredWidth;
      displayHeight = Math.round(spriteHeight * widthRatio);
    } else if (widthRatio > heightRatio) {
      // The height is smaller.
      displayWidth = Math.round(spriteWidth * heightRatio);
      displayHeight = desiredHeight;
    } else if (widthRatio !== 1) {
      // There the same, but not the original dimensions.
      displayWidth = desiredWidth;
      displayHeight = desiredHeight;
    }

    const commonProps = { spriteWidth, spriteHeight, displayWidth, displayHeight, key: this.props.mode };

    switch (this.props.mode) {
      case seed.BLOOM:
        return <AnimatedSprites src={bloomUrl} {...commonProps} spritesPerRow={5} totalSprites={20} />;
      case seed.SLEEPING:
        return <AnimatedSprites src={sleepingUrl} {...commonProps} spritesPerRow={5} totalSprites={20} loop />;
      case seed.WAKE_UP:
        return (
          <AnimatedSprites
            src={yawnUrl}
            {...commonProps}
            spritesPerRow={6}
            totalSprites={34}
            onFinish={() => this.props.makeMrSeedReady()}
          />
        );
      // case seed.LISTENING:
      //   emoji = '🤭';
      //   break;
      case seed.SMH:
        return <AnimatedSprites src={smhUrl} {...commonProps} spritesPerRow={5} totalSprites={16} />;
      case seed.THUMBS_UP:
        return <AnimatedSprites src={thumbsUpUrl} {...commonProps} spritesPerRow={5} totalSprites={20} />;
      case seed.READY:
      default:
        return (
          <AnimatedSprites
            src={idleUrl}
            {...commonProps}
            spritesPerRow={5}
            totalSprites={20}
            loop
            startPosition={[2, 1]}
            loopPause={1000}
          />
        );
    }
  }

  render() {
    return <div className="mod_readseed-flex-col mod_readseed-flex-items-center">{this.renderSprite()}</div>;
  }
}

const ConnectedSeed = connect(
  state => {
    return { mode: state.mrseed.mode, flowerUrl: null };
  },
  dispatch => bindActionCreators({ makeMrSeedReady }, dispatch)
)(MrSeed);

export default ConnectedSeed;
