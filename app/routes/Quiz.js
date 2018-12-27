import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import QuizQuestion from '../components/QuizQuestion';
import { setQuestionAnswer, setCurrentQuestionNumber, submitQuizResults } from '../state/actions';
import Passage from '../components/Passage';
import { getString } from '../lib/moodle';

class Quiz extends React.PureComponent {
    static propTypes = {
        attemptId: PropTypes.number.isRequired,
        answers: PropTypes.object.isRequired,
        questions: PropTypes.array.isRequired,
        currentQuestionNumber: PropTypes.number.isRequired,

        setCurrentQuestionNumber: PropTypes.func.isRequired,
        setQuestionAnswer: PropTypes.func.isRequired,
        submitQuizResults: PropTypes.func.isRequired
    };

    state = {
        go: null
    };

    handleAnswerSelected = answer => {
        this.props.setQuestionAnswer(this.props.currentQuestionNumber, answer);
    };

    handleGoToNextQuestion = () => {
        if (this.props.currentQuestionNumber < this.props.questions.length) {
            this.props.setCurrentQuestionNumber(this.props.currentQuestionNumber + 1);
        } else {
            this.props.submitQuizResults();
            this.setState({ go: 'toend' });
        }
    };

    getQuestion() {
        return this.props.questions.find(q => q.number == this.props.currentQuestionNumber);
    }

    getQuestionAnswer() {
        return this.props.answers[this.props.currentQuestionNumber];
    }

    render() {
        if (!this.props.currentQuestionNumber) {
            return null;
        } else if (this.state.go == 'toend') {
            return <Redirect to="/end" />;
        } else if (!this.props.attemptId) {
            return <Redirect to="/" />;
        }

        return (
            <div className="mod_readseed-flex-col mod_readseed-flex-1">
                <h3>{getString('readagainandanswer', 'mod_readseed')}</h3>
                <div className="mod_readseed-flex mod_readseed-flex-1">
                    <Passage style={{ flex: 2 }} />
                    <div className="mod_readseed-flex-1" style={{ marginLeft: '1em' }}>
                        <QuizQuestion
                            key={this.props.currentQuestionNumber}
                            question={this.getQuestion()}
                            canSelectAnswer={!this.getQuestionAnswer()}
                            selectedAnswer={this.getQuestionAnswer()}
                            onAnswerSelected={this.handleAnswerSelected}
                            onGoToNextQuestion={this.handleGoToNextQuestion}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const ConnectedQuiz = connect(
    state => ({
        questions: state.options.quizdata,
        currentQuestionNumber: state.quiz.currentQuestionNumber || 1,
        answers: state.quiz.answers,
        attemptId: state.attemptId
    }),
    dispatch => bindActionCreators({ setQuestionAnswer, setCurrentQuestionNumber, submitQuizResults }, dispatch)
)(Quiz);

export default ConnectedQuiz;
