import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getString } from '../lib/moodle';

import Recorder from '../components/Recorder';
import MrSeed from '../components/MrSeed';
import Passage from '../components/Passage';
import TextToSpeech from '../components/TextToSpeech';

import { sendSubmission, wakeUpMrSeed, makeMrSeedListen, makeMrSeedReady } from '../state/actions';

class Home extends React.PureComponent {
  static propTypes = {
    attemptId: PropTypes.any,
    name: PropTypes.string.isRequired,
    wakeUpMrSeed: PropTypes.func.isRequired,
    makeMrSeedListen: PropTypes.func.isRequired,
    makeMrSeedReady: PropTypes.func.isRequired,
    sendSubmission: PropTypes.func.isRequired,
    submissionSubmitted: PropTypes.bool.isRequired
  };

  state = {
    step: 'init',
    startedAt: null,
    recordTime: null,
    submitting: false
  };

  componentDidMount() {
    // Simulate that we've got a confirmation that the microphone works.
    setTimeout(this.handleMicrophoneConfirmed, 5000);
  }

  handleMicrophoneConfirmed = () => {
    this.setState({
      step: 'ready'
    });
    this.props.wakeUpMrSeed();
  };

  handleRecorderMessage = message => {
    if (message.type === 'recording' && message.action === 'started') {
      this.setState({ step: 'reading', startedAt: new Date() });
      this.props.makeMrSeedListen();
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
    return (
      <div className="mod_readseed-flex-1 mod_readseed-flex-col mod_readseed-flex-items-center mod_readseed-flex-equal">
        <h3>{getString('hia', 'mod_readseed', this.props.name)}</h3>
        <TextToSpeech>
          <p className="text-center">{getString('counttofive', 'mod_readseed')}</p>
        </TextToSpeech>
        <MrSeed />
      </div>
    );
  }

  renderReady() {
    return (
      <div className="mod_readseed-flex-1 mod_readseed-flex-col mod_readseed-flex-items-center mod_readseed-flex-equal">
        <h3>{getString('hia', 'mod_readseed', this.props.name)}</h3>
        <TextToSpeech>
          <p className="text-center">{getString('clickstartwhenready', 'mod_readseed')}</p>
        </TextToSpeech>
        <MrSeed />
      </div>
    );
  }

  renderReading() {
    return (
      <div className="mod_readseed-flex-1 mod_readseed-flex-col mod_readseed-flex-items-center">
        <h3>{getString('aisreading', 'mod_readseed', this.props.name)}</h3>
        <Passage className="mod_readseed-flex-1 mod_readseed-flex-col" style={{ width: '100%' }} />
      </div>
    );
  }

  renderRead() {
    return (
      <div className="mod_readseed-flex-1 mod_readseed-flex-col mod_readseed-flex-items-center">
        <h3>{getString('nicereadinga', 'mod_readseed', this.props.name)}</h3>
        <div
          className="mod_readseed-flex-1 mod_readseed-flex-col mod_readseed-flex-items-center"
          style={{ justifyContent: 'space-around' }}
        >
          <MrSeed />
          <div className="mod_readseed-flex-col mod_readseed-flex-items-center">
            {!this.props.submissionSubmitted ? <p>⏳ {getString('pleasewaitafewseconds', 'mod_readseed')}</p> : null}
            {this.props.submissionSubmitted ? (
              <Fragment>
                <TextToSpeech>
                  <p>{getString('readpassageagainandanswerquestions', 'mod_readseed')}</p>
                </TextToSpeech>
                <button disabled={!this.props.submissionSubmitted} onClick={() => this.setState({ step: 'toquiz' })}>
                  Go
                </button>
              </Fragment>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  render() {
    let content;
    let aboveRecorder;
    switch (this.state.step) {
      case 'init':
        content = this.renderInit();
        break;
      case 'ready':
        content = this.renderReady();
        break;
      case 'reading':
        content = this.renderReading();
        aboveRecorder = <MrSeed />;
        break;
      case 'read':
        content = this.renderRead();
        break;
      case 'toquiz':
        content = <Redirect to={'/quiz'} />;
        break;
    }
    return (
      <div className="mod_readseed-flex mod_readseed-flex-1">
        <div className="mod_readseed-flex mod_readseed-flex-1">{content}</div>
        <div className="mod_readseed-flex-col mod_readseed-flex-items-center">
          {aboveRecorder}
          <Recorder onMessageReceived={this.handleRecorderMessage} />
        </div>
      </div>
    );
  }
}

const ConnectedHome = connect(
  state => ({ name: state.options.firstname, submissionSubmitted: state.submissionSubmitted, attemptId: state.attemptId }),
  dispatch => bindActionCreators({ sendSubmission, wakeUpMrSeed, makeMrSeedListen, makeMrSeedReady }, dispatch)
)(Home);

export default ConnectedHome;
