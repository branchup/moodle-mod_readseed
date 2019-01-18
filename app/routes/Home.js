import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getString } from '../lib/moodle';

import Recorder from '../components/Recorder';
import MrSeed from '../components/MrSeed';
import Passage from '../components/Passage';

import {
    sendSubmission,
    wakeUpMrSeed,
    makeMrSeedListen,
    makeMrSeedReady,
    makeMrSeedGiveThumbsUp,
    makeMrSeedStatic
} from '../state/actions';

class Home extends React.PureComponent {
    static propTypes = {
        attemptId: PropTypes.any,
        name: PropTypes.string.isRequired,
        wakeUpMrSeed: PropTypes.func.isRequired,
        makeMrSeedListen: PropTypes.func.isRequired,
        makeMrSeedReady: PropTypes.func.isRequired,
        makeMrSeedGiveThumbsUp: PropTypes.func.isRequired,
        sendSubmission: PropTypes.func.isRequired,
        submissionSubmitted: PropTypes.bool.isRequired
    };

    state = {
        step: 'init',
        startedAt: null,
        recordTime: null,
        submitting: false,
        countdown: '...'
    };

    componentDidMount() {
        // On load, if we have an attempt ID, it means we're resuming the quiz.
        if (this.props.attemptId) {
            this.setState({ step: 'toquiz' });
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.submissionSubmitted && this.props.submissionSubmitted) {
            this.props.makeMrSeedGiveThumbsUp();
        }
    }

    handleRecorderMessage = message => {
        // console.log(message);
        if (message.type === 'recorderstatus' && message.status === 'testbuttonready') {
            this.setState({ step: 'waiting' });
        } else if (message.type === 'recorderstatus' && message.status === 'testbuttonrecording') {
            this.setState({ step: 'testing' });
            this.props.makeMrSeedListen();
        } else if (message.type === 'recorderstatus' && message.status === 'startbuttonready') {
            this.setState({ step: 'ready' });
            this.props.makeMrSeedGiveThumbsUp();
        } else if (message.type === 'countdownstatus') {
            this.setState({ step: 'countdown', countdown: message.status });
            this.props.makeMrSeedReady();
        } else if (message.type === 'recording' && message.action === 'started') {
            this.setState({ step: 'reading', startedAt: new Date() });
            this.props.makeMrSeedStatic();
        } else if (message.type === 'recording' && message.action === 'stopped') {
            let recordTime = new Date().getTime() - this.state.startedAt.getTime();
            recordTime = recordTime > 0 ? Math.ceil(recordTime / 1000) : recordTime;
            this.setState({ step: 'read', recordTime: recordTime });
            this.props.makeMrSeedReady();
        } else if (message.type === 'awaitingprocessing' && !this.state.submitting) {
            this.setState({ submitting: true });
            this.props.sendSubmission(message.mediaurl, this.state.recordTime);
        }
    };

    renderInit() {
        return <MrSeed width={600} />;
    }

    renderWaiting() {
        return <MrSeed width={600} message={getString('hellopushspeak', 'mod_readseed')} />;
    }

    renderTesting() {
        return <MrSeed width={600} message={getString('sayyourname', 'mod_readseed')} />;
    }

    renderReady() {
        return <MrSeed width={600} message={getString('hellonpushstart', 'mod_readseed', this.props.name)} />;
    }

    renderReading() {
        return (
            <div
                className={`mod_readseed-flex-1 mod_readseed-flex-col mod_readseed-flex-items-center`}
                style={{ alignSelf: 'stretch' }}
            >
                <Passage
                    className="mod_readseed-flex-1 mod_readseed-flex-col"
                    style={{ width: '100%' }}
                    showImage={false}
                    blurred={this.state.step === 'countdown'}
                />
            </div>
        );
    }

    renderRead() {
        const message = this.props.submissionSubmitted
            ? getString('greatjobnpushnext', 'mod_readseed', this.props.name)
            : getString('pleasewait', 'mod_readseed');
        return <MrSeed width={600} message={message} />;
    }

    render() {
        let content;
        let sideContent;
        let nextBtn;
        let showRecorder = true;
        switch (this.state.step) {
            case 'init':
                content = this.renderInit();
                break;
            case 'waiting':
                content = this.renderWaiting();
                break;
            case 'testing':
                content = this.renderTesting();
                break;
            case 'ready':
                content = this.renderReady();
                break;
            case 'countdown':
                content = this.renderReading();
                sideContent = <MrSeed width={300} message={`${this.state.countdown}`} bubbleSize="medium" />;
                break;
            case 'reading':
                content = this.renderReading();
                sideContent = <MrSeed width={300} />;
                break;
            case 'read':
                content = this.renderRead();
                showRecorder = !this.props.submissionSubmitted;
                nextBtn = !this.props.submissionSubmitted ? null : (
                    <a
                        href="#"
                        className="mod_readseed-btn-recorder-like"
                        onClick={e => {
                            e.preventDefault();
                            this.setState({ step: 'toquiz' });
                        }}
                    >
                        {getString('next')}
                    </a>
                );
                break;
            case 'toquiz':
                showRecorder = false;
                content = <Redirect to={'/quiz'} />;
                break;
        }

        const recorderStyles = sideContent
            ? {
                  position: 'absolute',
                  right: '30px',
                  bottom: '50px'
              }
            : {
                  position: 'absolute',
                  right: '210px',
                  bottom: '240px'
              };

        return (
            <div className="mod_readseed-flex mod_readseed-flex-1 mod_readseed-flex-items-center">
                <div
                    className="mod_readseed-flex mod_readseed-flex-1"
                    style={{
                        alignSelf: 'stretch',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {content}
                </div>
                <div
                    className="mod_readseed-flex-col mod_readseed-flex-items-center"
                    style={{ minWidth: sideContent ? '' : '200px' }}
                >
                    {sideContent}
                </div>
                <div style={recorderStyles}>
                    {showRecorder ? <Recorder onMessageReceived={this.handleRecorderMessage} /> : nextBtn}
                </div>
            </div>
        );
    }
}

const ConnectedHome = connect(
    state => ({
        name: state.options.firstname,
        submissionSubmitted: state.submissionSubmitted,
        attemptId: state.attemptId
    }),
    dispatch =>
        bindActionCreators(
            {
                sendSubmission,
                wakeUpMrSeed,
                makeMrSeedListen,
                makeMrSeedReady,
                makeMrSeedStatic,
                makeMrSeedGiveThumbsUp
            },
            dispatch
        )
)(Home);

export default ConnectedHome;
