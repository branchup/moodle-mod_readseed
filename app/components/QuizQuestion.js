import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MrSeed from '../components/MrSeed';
import { getString } from '../lib/moodle';
import Question from '../components/Question';
import { makeMrSeedReady, makeMrSeedShakeHead, makeMrSeedGiveThumbsUp } from '../state/actions';

class QuizQuestion extends React.PureComponent {
    static propTypes = {
        question: PropTypes.object.isRequired,
        selectedAnswer: PropTypes.number,
        canSelectAnswer: PropTypes.bool,

        makeMrSeedReady: PropTypes.func.isRequired,
        makeMrSeedShakeHead: PropTypes.func.isRequired,
        makeMrSeedGiveThumbsUp: PropTypes.func.isRequired,

        onAnswerSelected: PropTypes.func.isRequired,
        onGoToNextQuestion: PropTypes.func.isRequired
    };

    static defaultProps = {
        canSelectAnswer: true
    };

    state = {
        shakeButton: false
    };

    nextAnimationTimeout = null;

    componentDidMount() {
        this.animate('ready');
    }

    componentDidUpdate(prevProps) {
        // When the selected answer changes, we animate MrSeed.
        if (this.props.selectedAnswer && prevProps.selectedAnswer !== this.props.selectedAnswer) {
            const correct = this.isCorrectAnswer(this.props.selectedAnswer);
            if (!correct) {
                this.animate('smh');
            } else {
                this.animate('thumbsup');
            }
        }
    }

    animate(mode, nextMode) {
        if (this.nextAnimationTimeout) {
            clearTimeout(this.nextAnimationTimeout);
            this.nextAnimationTimeout = null;
        }

        if (mode == 'ready') {
            this.props.makeMrSeedReady();
        } else if (mode == 'smh') {
            this.props.makeMrSeedShakeHead();
        } else if (mode == 'thumbsup') {
            this.props.makeMrSeedGiveThumbsUp();
        }

        if (nextMode) {
            this.nextAnimationTimeout = setTimeout(_ => {
                this.animate(nextMode);
            }, 2000);
        }
    }

    handleAnswerSelected = answer => {
        // We cannot change our answer.
        if (!this.props.canSelectAnswer) {
            return;
        }
        this.props.onAnswerSelected(answer);
    };

    handleNextClick = () => {
        if (!this.props.selectedAnswer) {
            this.handleAnswerNotProvided();
            return;
        }
        this.props.onGoToNextQuestion();
    };

    handleAnswerNotProvided = () => {
        if (this.state.shakeButton) {
            return;
        }
        this.setState({ shakeButton: true }, () => {
            setTimeout(() => {
                this.setState({ shakeButton: false });
            }, 200);
        });
        this.animate('smh', 'ready');
    };

    isCorrectAnswer(answer) {
        return answer && answer == this.props.question.correctanswer;
    }

    render() {
        const { question } = this.props;
        return (
            <Fragment>
                <div>
                    <Question
                        question={question}
                        correctAnswer={question.correctanswer}
                        selectedAnswer={this.props.selectedAnswer}
                        onAnswerSelected={this.handleAnswerSelected}
                    />
                </div>
                <div className="mod_readseed-flex-col mod_readseed-flex-items-center">
                    <div>
                        <button
                            className={`btn btn-default ${this.state.shakeButton ? 'mod_readseed-shake' : ''}`}
                            onClick={this.handleNextClick}
                        >
                            {getString('next')}
                        </button>
                    </div>
                    <div>
                        <MrSeed height={200} />
                    </div>
                </div>
            </Fragment>
        );
    }
}

const ConnectedQuizQuestion = connect(
    null,
    dispatch => bindActionCreators({ makeMrSeedReady, makeMrSeedShakeHead, makeMrSeedGiveThumbsUp }, dispatch)
)(QuizQuestion);

export default ConnectedQuizQuestion;
