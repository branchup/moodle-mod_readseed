import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class AnimatedSprites extends PureComponent {
    static propTypes = {
        src: PropTypes.string.isRequired,
        fps: PropTypes.number,
        loop: PropTypes.bool,
        loopPause: PropTypes.number,
        startPosition: PropTypes.arrayOf(PropTypes.number),

        spriteWidth: PropTypes.number.isRequired,
        spriteHeight: PropTypes.number.isRequired,
        spritesPerRow: PropTypes.number.isRequired,
        totalSprites: PropTypes.number.isRequired,

        displayHeight: PropTypes.number,
        displayWidth: PropTypes.number,

        onFinish: PropTypes.func
    };

    static defaultProps = {
        fps: 16,
        loop: false,
        loopPause: 0,
        startPosition: [0, 0]
    };

    constructor(props) {
        super(props);
        this.state = {
            pos: props.startPosition
        };
    }

    animate = () => {
        let [x, y] = this.state.pos;
        if (x + 1 < this.props.spritesPerRow) {
            x++;
        } else {
            x = 0;
            y++;
        }

        const total = y * this.props.spritesPerRow + x + 1;
        if (total > this.props.totalSprites) {
            [x, y] = [0, 0];
        }

        if (this.props.startPosition[0] === x && this.props.startPosition[1] === y) {
            if (!this.props.loop) {
                this.stopAnimation();
                this.props.onFinish && this.props.onFinish();
                return;
            }

            if (this.props.loopPause) {
                this.stopAnimation();
                this.loop = setTimeout(() => {
                    this.setState({ pos: [x, y] });
                    this.startAnimation();
                }, this.props.loopPause);
                return;
            }
        }

        this.setState({ pos: [x, y] });
    };

    componentDidMount() {
        this.startAnimation();
    }

    componentWillUnmount() {
        this.stopAnimation();
        this.cancelLoop();
    }

    cancelLoop() {
        clearTimeout(this.loop);
    }

    startAnimation() {
        this.interval = setInterval(this.animate, Math.round(1000 / this.props.fps));
    }

    stopAnimation() {
        clearInterval(this.interval);
    }

    render() {
        const [displayWidth, displayHeight] = [
            this.props.displayWidth || this.props.spriteWidth,
            this.props.displayHeight || this.props.spriteHeight
        ];
        const [totalWidth, totalHeight] = [
            this.props.spriteWidth * this.props.spritesPerRow,
            this.props.spriteHeight * Math.ceil(this.props.totalSprites / this.props.spritesPerRow)
        ];
        const [backgroundWidth, backgroundHeight] = [
            Math.round((this.props.displayWidth / this.props.spriteWidth) * totalWidth),
            Math.round((this.props.displayHeight / this.props.spriteHeight) * totalHeight)
        ];
        const style = {
            width: `${displayWidth}px`,
            height: `${displayHeight}px`,
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${this.props.src})`,
            backgroundPosition: `${this.state.pos[0] * -displayWidth}px ${this.state.pos[1] * -displayHeight}px`,
            backgroundSize: `${backgroundWidth}px ${backgroundHeight}px`
        };
        return <div style={style} />;
    }
}

export default AnimatedSprites;
