import React from 'react';
import PropTypes from 'prop-types';

const QuizTrackerElement = props => {
    const { number, answered, current, correct } = props;
    const classes = `mod_readseed-quiz-tracker-el ${answered ? 'is-answered' : ''} ${correct ? 'is-correct' : ''} ${
        current ? 'is-current' : ''
    }`;
    return <div className={classes}>{number}</div>;
};

QuizTrackerElement.propTypes = {
    number: PropTypes.number.isRequired,
    answered: PropTypes.bool.isRequired,
    correct: PropTypes.bool.isRequired,
    current: PropTypes.bool.isRequired
};

const QuizTracker = props => (
    <div className="mod_readseed-quiz-tracker">
        {props.questions.map(q => {
            const current = q.number === props.currentQuestionNumber;
            const answered = typeof props.answers[q.number] !== 'undefined';
            const correct = answered && props.answers[q.number] == q.correctanswer;
            return <QuizTrackerElement number={q.number} current={current} answered={answered} correct={correct} key={q.number} />;
        })}
    </div>
);

QuizTracker.propTypes = {
    questions: PropTypes.arrayOf(PropTypes.object).isRequired,
    answers: PropTypes.arrayOf(PropTypes.number).isRequired,
    currentQuestionNumber: PropTypes.number.isRequired
};

export default QuizTracker;
