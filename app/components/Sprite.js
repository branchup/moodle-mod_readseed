import React from 'react';
import PropTypes from 'prop-types';

const Sprite = props => {
    const [displayWidth, displayHeight] = [props.displayWidth || props.spriteWidth, props.displayHeight || props.spriteHeight];
    const [totalWidth, totalHeight] = [
        props.spriteWidth * props.spritesPerRow,
        props.spriteHeight * Math.ceil(props.totalSprites / props.spritesPerRow)
    ];
    const [backgroundWidth, backgroundHeight] = [
        Math.round((props.displayWidth / props.spriteWidth) * totalWidth),
        Math.round((props.displayHeight / props.spriteHeight) * totalHeight)
    ];
    const style = {
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${props.src})`,
        backgroundPosition: `${props.posX * -displayWidth}px ${props.posY * -displayHeight}px`,
        backgroundSize: `${backgroundWidth}px ${backgroundHeight}px`
    };
    return <div style={style} />;
};

Sprite.propTypes = {
    src: PropTypes.string.isRequired,
    spriteWidth: PropTypes.number.isRequired,
    spriteHeight: PropTypes.number.isRequired,
    spritesPerRow: PropTypes.number.isRequired,
    totalSprites: PropTypes.number.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired,
    displayWidth: PropTypes.number,
    displayHeight: PropTypes.number
};

export default Sprite;
