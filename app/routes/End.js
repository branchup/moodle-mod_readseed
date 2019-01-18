import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MrSeed from '../components/MrSeed';
import Button from '../components/Button';
import AssetsLoader from '../components/AssetsLoader';
import { getString } from '../lib/moodle';
import { makeMrSeedBloom, makeMrSeedReady } from '../state/actions';

class End extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        makeMrSeedBloom: PropTypes.func.isRequired,
        flowerUrl: PropTypes.string.isRequired
    };

    state = {};

    componentDidMount() {
        this.props.makeMrSeedReady();
    }

    makeBloom = () => {
        // Add a slight delay or it all happens too fast.
        setTimeout(this.props.makeMrSeedBloom, 1500);
    };

    render() {
        return (
            <div className="mod_readseed-flex-col mod_readseed-flex-items-center mod_readseed-flex-1">
                <AssetsLoader images={[this.props.flowerUrl]} onLoad={this.makeBloom} />
                <h3>{getString('congratsyouread', 'mod_readseed', this.props.name)}</h3>
                <div className="mod_readseed-flex-1 mod_readseed-flex mod_readseed-flex-items-center">
                    <MrSeed height={500} />
                </div>
                <div style={{ margin: '20px' }}>
                    <Button onClick={() => (window.location.href = this.props.finishUrl)}>Finish</Button>
                </div>
            </div>
        );
    }
}

const ConnectedEnd = connect(
    state => ({ name: state.options.name, flowerUrl: state.flower.picurl, finishUrl: state.options.courseurl }),
    dispatch => bindActionCreators({ makeMrSeedBloom, makeMrSeedReady }, dispatch)
)(End);

export default ConnectedEnd;
