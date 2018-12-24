import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Passage extends React.PureComponent {
    static propTypes = {
        text: PropTypes.string.isRequired,
        imageUrl: PropTypes.string
    };

    render() {
        return (
            <div style={{ display: 'flex' }}>
                {this.imageUrl ? (
                    <div style={{ maxWidth: '200px', marginRight: '1em' }}>
                        <img src={this.imageUrl} alt="" style={{ maxWidth: '100%' }} />
                    </div>
                ) : null}
                <div style={{ flex: 1 }}>{this.props.text}</div>
            </div>
        );
    }
}

const ConnectedPassage = connect(state => ({ text: state.options.passage, imageUrl: state.options.passagepictureurl }))(Passage);

export default ConnectedPassage;
