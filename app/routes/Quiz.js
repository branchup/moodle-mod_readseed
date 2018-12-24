import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import Passage from '../components/Passage';
import Question from '../components/Question';
import { getString } from '../lib/moodle';
import { setCurrentQuestionNumber, submitQuizResults, makeMrSeedReady } from '../state/actions';

class Quiz extends React.PureComponent {
    static propTypes = {
        attemptId: PropTypes.number,
        currentQuestionNumber: PropTypes.number,
        questions: PropTypes.array.isRequired,
        makeMrSeedReady: PropTypes.func.isRequired,
        submitQuizResults: PropTypes.func.isRequired,
        setCurrentQuestionNumber: PropTypes.func.isRequired
    };

    state = {
        go: null
    };

    componentDidMount() {
        this.props.makeMrSeedReady();
        if (!this.props.currentQuestionNumber) {
            this.props.setCurrentQuestionNumber(this.props.questions[0].number);
        }
    }

    handleClickNext = () => {
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

    render() {
        if (!this.props.currentQuestionNumber) {
            return null;
        } else if (this.state.go == 'toend') {
            return <Redirect to="/end" />;
        } else if (!this.props.attemptId) {
            return <Redirect to="/" />;
        }

        const question = this.getQuestion();
        return (
            <div>
                <h3>{getString('readagainandanswer', 'mod_readseed')}</h3>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 2 }}>
                        <Passage />
                    </div>
                    <div style={{ marginLeft: '1em', flex: 1 }}>
                        <Question question={question} onClickNext={this.handleClickNext} key={this.props.currentQuestionNumber} />
                    </div>
                </div>
            </div>
        );
    }
}

const ConnectedQuiz = connect(
    state => ({
        questions: state.options.quizdata,
        currentQuestionNumber: state.currentQuestionNumber,
        attemptId: state.attemptId
    }),
    dispatch => bindActionCreators({ setCurrentQuestionNumber, makeMrSeedReady, submitQuizResults }, dispatch)
)(Quiz);

export default ConnectedQuiz;
