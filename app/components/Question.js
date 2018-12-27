import React from 'react';
import PropTypes from 'prop-types';

import TextToSpeech from './TextToSpeech';

class Question extends React.PureComponent {
    static propTypes = {
        question: PropTypes.object.isRequired,
        onAnswerSelected: PropTypes.func.isRequired,
        correctAnswer: PropTypes.number, // When provided, will display visual feedback.
        selectedAnswer: PropTypes.number
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

    handleAnswerSelected = (e, answer) => {
        e.preventDefault();
        this.props.onAnswerSelected(answer.index);
    };

    renderAnswer = answer => {
        const answered = this.props.selectedAnswer;
        const isSelected = answer.index == this.props.selectedAnswer;
        let classNames = isSelected ? ['is-selected'] : [];

        if (this.props.correctAnswer) {
            const isCorrect = answered && this.props.correctAnswer == answer.index;
            const isIncorrect = answered && !isCorrect;
            if (isCorrect) {
                classNames.push('is-correct');
            } else if (isIncorrect) {
                classNames.push('is-incorrect');
            }
        }

        return (
            <a
                href="#"
                key={answer.index}
                onClick={e => this.handleAnswerSelected(e, answer)}
                className={`${classNames.join(' ')} mod_readseed-answer`}
            >
                {answer.text}
            </a>
        );
    };

    render() {
        const { question: q } = this.props;
        const answers = this.getAnswers();
        return (
            <div className={`${this.props.selectedAnswer ? 'is-answered' : ''} mod_readseed-question`}>
                <div className="mod_readseed-question-title">
                    <TextToSpeech>
                        <span dangerouslySetInnerHTML={{ __html: q.text }} />
                    </TextToSpeech>
                </div>
                <div className="mod_readseed-answers">{answers.map(this.renderAnswer)}</div>
            </div>
        );
    }
}

export default Question;
