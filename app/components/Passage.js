import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ScrollView from './ScrollView';

class Passage extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,

        blurred: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string
    };

    render() {
        const { blurred } = this.props;
        return (
            <div style={{ position: 'relative', ...this.props.style }} className={this.props.className}>
                <ScrollView>
                    <div className={`mod_readseed-passage ${blurred ? 'blurred' : ''}`}>
                        <div>
                            {this.props.imageUrl ? (
                                <div className="mod_readseed-passage-pic">
                                    <img src={this.props.imageUrl} alt="" role="decoration" />
                                </div>
                            ) : null}
                            {this.props.text}
                        </div>
                    </div>
                </ScrollView>
            </div>
        );
    }
}

const ConnectedPassage = connect(state => ({ text: state.options.passage, imageUrl: state.options.passagepictureurl }))(Passage);

export default ConnectedPassage;
