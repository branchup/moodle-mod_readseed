import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MrSeed from '../components/MrSeed';
import TextToSpeech from '../components/TextToSpeech';
import { getString } from '../lib/moodle';
import { makeMrSeedBloom } from '../state/actions';

class End extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        makeMrSeedBloom: PropTypes.func.isRequired
    };

    state = {};

    componentDidMount() {
        this.props.makeMrSeedBloom();
    }

    render() {
        return (
            <div className="mod_readseed-flex-col mod_readseed-flex-equal mod_readseed-flex-items-center mod_readseed-flex-1">
                <h3>{getString('goodjoba', 'mod_readseed', this.props.name)}</h3>
                <TextToSpeech>
                    <p>{getString('teacherwillcheck', 'mod_readseed')}</p>
                </TextToSpeech>
                <MrSeed />
            </div>
        );
    }
}

const ConnectedEnd = connect(
    state => ({ name: state.options.firstname }),
    dispatch => bindActionCreators({ makeMrSeedBloom }, dispatch)
)(End);

export default ConnectedEnd;
