import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TextToSpeech from './TextToSpeech';
import MrSeed from './MrSeed';
import { getString } from '../lib/moodle';
import { makeMrSeedShakeHead, makeMrSeedGiveThumbsUp, makeMrSeedReady } from '../state/actions';

class Question extends React.PureComponent {
    static propTypes = {
        question: PropTypes.object.isRequired,
        makeMrSeedReady: PropTypes.func.isRequired,
        makeMrSeedShakeHead: PropTypes.func.isRequired,
        makeMrSeedGiveThumbsUp: PropTypes.func.isRequired,
        onClickNext: PropTypes.func.isRequired
    };

    state = {
        answer: null,
        correct: false
    };

    getAnswers() {
        const q = this.props.question;
        const answers = [];
        for (let i = 1; i <= 4; i++) {
            answers.push({
                index: i,
                text: q[`answer${i}`]
            });
        }
        return answers;
    }

    handleNextClick = e => {
        e.preventDefault();
        this.props.onClickNext();
    };

    handleTryAgainClick = e => {
        this.setState({ answer: null });
        this.props.makeMrSeedReady();
    };

    handleSelectAnswer = answer => {
        // We change selection.
        if (this.state.answer) {
            return;
        }

        const correct = answer.index == this.props.question.correctanswer;
        this.setState({ answer: answer.index, correct: correct });
        if (!correct) {
            this.props.makeMrSeedShakeHead();
        } else {
            this.props.makeMrSeedGiveThumbsUp();
        }
    };

    renderAnswer = answer => {
        return (
            <div key={answer.index} onClick={() => this.handleSelectAnswer(answer)}>
                {answer.index == this.state.answer ? '🔘' : '⚪'}
                {answer.text}
            </div>
        );
    };

    renderFeedback() {
        if (!this.state.answer) {
            return;
        }
        if (!this.state.correct) {
            return (
                <div>
                    <div>
                        <p>🛑 {getString('thisisnotcorrect', 'mod_readseed')}</p>
                    </div>
                    <button onClick={this.handleTryAgainClick}>{getString('tryagain', 'mod_readseed')}</button>
                </div>
            );
        }
        return (
            <div>
                <div>
                    <p>🌟 {getString('thisiscorrect', 'mod_readseed')}</p>
                </div>
                <button onClick={this.handleNextClick}>{getString('next')}</button>
            </div>
        );
    }

    render() {
        const { question: q } = this.props;
        const answers = this.getAnswers();
        return (
            <div>
                <div>
                    <TextToSpeech>
                        <span dangerouslySetInnerHTML={{ __html: q.text }} />
                    </TextToSpeech>
                </div>
                <div>{answers.map(this.renderAnswer)}</div>
                {this.renderFeedback()}
                <div>
                    <MrSeed />
                </div>
            </div>
        );
    }
}

const ConnectedQuestion = connect(
    null,
    dispatch => bindActionCreators({ makeMrSeedShakeHead, makeMrSeedGiveThumbsUp, makeMrSeedReady }, dispatch)
)(Question);

export default ConnectedQuestion;
