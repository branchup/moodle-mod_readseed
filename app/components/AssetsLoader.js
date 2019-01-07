import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class AssetsLoader extends PureComponent {
  // Changing some props after mounting will not have any effect.
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.string),
    onLoad: PropTypes.func,
    render: PropTypes.func
  };

  static defaultProps = {
    images: [],
    onLoad: () => {},
    render: () => null
  };

  state = {
    imagesLoaded: 0,
    loaded: false
  };

  constructor(props) {
    super(props);
    this.imageLoaders = [];
  }

  componentDidMount() {
    const { images } = this.props;

    images.forEach((imageSrc, i) => {
      const img = new Image();
      img.addEventListener('load', () => this.imageLoaded(i));
      img.src = imageSrc;
      this.imageLoaders[i] = img;
    });

    this.checkLoadingState();
  }

  checkLoadingState = () => {
    if (this.itemsLoaded() >= this.itemsToLoad()) {
      this.setState({ loaded: true });
      this.props.onLoad();
    }
  };

  getLoadingPercentage() {
    const toLoad = this.itemsToLoad();
    return toLoad > 0 ? this.itemsLoaded() / toLoad : 1;
  }

  imageLoaded = index => {
    this.setState(state => ({ imagesLoaded: state.imagesLoaded + 1 }), this.checkLoadingState);
  };

  itemsLoaded() {
    return this.state.imagesLoaded;
  }

  itemsToLoad() {
    return this.props.images.length;
  }

  render() {
    return this.props.render({ ratio: this.getLoadingPercentage() });
  }
}

export default AssetsLoader;
