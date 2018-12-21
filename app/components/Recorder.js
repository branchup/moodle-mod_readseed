import React from 'react';
import { connect } from 'react-redux';

import { getModule } from '../lib/cloudpoodll';

class Recorder extends React.PureComponent {
  state = {
    loaded: false
  };

  constructor(props) {
    super(props);
    this.divRef = React.createRef();
    this.domId = 'therecorderid';
  }

  componentDidMount() {
    // Initialise the recorder.
    const CloudPoodll = getModule();
    CloudPoodll.createRecorder(this.domId);
    CloudPoodll.theCallback = this.handleEvents;
    CloudPoodll.initEvents();
    this.CloudPoodll = CloudPoodll;

    // Find the iframe.
    this.iframe = this.divRef.current.querySelector('iframe');

    // Observe the onload event.
    const origOnLoad = this.iframe.onload;
    this.iframe.onload = (...args) => {
      origOnLoad && origOnLoad.bind(this.iframe)(...args);
      this.setState({ loaded: true });
    };
  }

  handleEvents = message => {
    console.log(message);
  };

  render() {
    const wrapperStyles = this.state.loaded ? { backgroundImage: 'none' } : {};
    return (
      <div className="mod_readseed_recording_cont" style={wrapperStyles}>
        <div id="mod_readseed_recorder_cont" className="mod_readseed_recorder_cont mod_readseed_center">
          <div
            ref={this.divRef}
            className="mod_readseed_center"
            id={this.domId}
            data-id={this.props.id}
            data-parent={this.props.parent}
            data-localloading={this.props.localloading}
            data-localloader={this.props.localloader}
            data-media={this.props.media}
            data-appid={this.props.appid}
            data-type={this.props.type}
            data-width={this.props.width}
            data-height={this.props.height}
            // data-iframeclass={this.props.iframeclass}
            data-updatecontrol={this.props.updatecontrol}
            data-timelimit={this.props.timelimit}
            data-transcode={this.props.transcode ? 1 : 0}
            data-transcribe={this.props.transcribe ? 1 : 0}
            data-language={this.props.language}
            data-expiredays={this.props.expiredays}
            data-region={this.props.region}
            data-fallback={this.props.fallback}
            data-hints={this.props.hints}
            data-token={this.props.token}
          />
        </div>
      </div>
    );
  }
}

const ConnectedRecorder = connect(state => ({
  id: state.recorder.config.id,
  parent: state.recorder.config.parent,
  localloading: state.recorder.config.localloading,
  localloader: state.recorder.config.localloader,
  media: state.recorder.config.media,
  appid: state.recorder.config.appid,
  type: state.recorder.config.type,
  width: state.recorder.config.width,
  height: state.recorder.config.height,
  iframeclass: state.recorder.config.iframeclass,
  updatecontrol: state.recorder.config.updatecontrol,
  timelimit: state.recorder.config.timelimit,
  transcode: state.recorder.config.transcode,
  transcribe: state.recorder.config.transcribe,
  language: state.recorder.config.language,
  expiredays: state.recorder.config.expiredays,
  region: state.recorder.config.region,
  fallback: state.recorder.config.fallback,
  hints: state.recorder.config.hints,
  token: state.recorder.config.token
}))(Recorder);

export default ConnectedRecorder;
