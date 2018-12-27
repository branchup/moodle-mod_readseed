import React from 'react';
import PropTypes from 'prop-types';
import sizeMe, { withSize } from 'react-sizeme';

const sizeMeOptions = { monitorHeight: true, monitorWidth: false };
const ScrollViewContent = sizeMe(sizeMeOptions)(props => props.children);

class ScrollView extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        style: PropTypes.object,
        children: PropTypes.any,
        size: PropTypes.object
    };

    static defaultProps = {
        className: ''
    };

    state = {
        isScrollable: false,
        maxScroll: 0,
        scrollingTo: 0
    };

    constructor(props) {
        super(props);
        this.divRef = React.createRef();
    }

    componentDidMount() {
        this.setUp();
    }

    componentDidUpdate(prevProps) {
        if (this.props.children !== prevProps.children) {
            this.setUp();
        }
    }

    canScrollUp() {
        return this.state.scrollingTo > 0;
    }

    canScrollDown() {
        return this.state.scrollingTo < this.getMaxScroll();
    }

    getMaxScroll() {
        const node = this.divRef.current;
        if (!node) {
            return 0;
        }
        const visibleHeight = node.clientHeight;
        const totalHeight = node.scrollHeight;
        return Math.max(0, totalHeight - visibleHeight);
    }

    handleContentSizeChange = () => {
        this.setUp();
    };

    handleScrollDown = () => {
        this.scrollBy(100);
    };

    handleScrollUp = () => {
        this.scrollBy(-100);
    };

    scrollBy(value) {
        const node = this.divRef.current;
        const to = Math.max(0, node.scrollTop + value);
        node.scrollTo({
            top: to,
            behavior: 'smooth'
        });
        this.setState({ scrollingTo: to });
    }

    setUp() {
        if (!this.divRef.current) {
            return;
        }
        if (this.getMaxScroll() > 0) {
            this.setState({ isScrollable: true, scrollingTo: 0 });
        }
        this.divRef.current.scrollTo(0, 0);
    }

    renderBeforeContent() {
        if (!this.state.isScrollable) {
            return;
        }
        return <div className="mod_readseed-scrollview-before" />;
    }

    renderScrollButtons() {
        if (!this.state.isScrollable) {
            return;
        }

        return (
            <div className="mod_readseed-scrollview-actions">
                <button onClick={this.handleScrollUp} disabled={!this.canScrollUp()}>
                    ⬆
                </button>
                <button onClick={this.handleScrollDown} disabled={!this.canScrollDown()}>
                    ⬇
                </button>
            </div>
        );
    }

    render() {
        const { isScrollable } = this.state;
        return (
            <div className={`mod_readseed-scrollview-wrapper`}>
                <div className={`mod_readseed-scrollview`} ref={this.divRef}>
                    <ScrollViewContent onSize={this.handleContentSizeChange}>{this.props.children}</ScrollViewContent>
                    {isScrollable ? <div style={{ height: '100px', minHeight: '100px' }} /> : null}
                </div>
                {this.renderBeforeContent()}
                {this.renderScrollButtons()}
            </div>
        );
    }
}

export default withSize(sizeMeOptions)(ScrollView);
