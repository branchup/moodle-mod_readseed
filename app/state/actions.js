import { createAction } from 'redux-actions';
import * as Moodle from '../lib/moodle';
import * as seed from '../lib/seed';

// Passage.
export const submissionSubmitted = createAction('submissionSubmitted', attemptId => ({ attemptId }));

export const sendSubmission = (mediaUrl, recordTime) => {
  return (dispatch, getState) => {
    const { wwwroot, cmid } = getState().options;
    Moodle.sendSubmission(wwwroot, cmid, mediaUrl, recordTime)
      .then(attemptId => {
        dispatch(submissionSubmitted(attemptId));
      })
      .catch(() => {
        // Handle error.
      });
  };
};

// Quiz.
export const setQuestionAnswer = createAction('setQuestionAnswer', (questionNumber, answerIndex) => ({
  questionNumber,
  answerIndex
}));
export const setCurrentQuestionNumber = createAction('setCurrentQuestionNumber', questionNumber => ({ questionNumber }));
export const submitQuizResults = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { wwwroot, cmid } = state.options;
    const { attemptId, flower } = state;
    const { answers } = state.quiz;
    if (!attemptId) {
      throw new Error('Whoops, attempt ID unknown!');
    }
    Moodle.sendQuizResults(wwwroot, cmid, attemptId, { answers }, flower.id)
      .then(flower => {
        dispatch(setFlower(flower));
      })
      .catch(err => {
        console.log(err);
      });
  };
};

// Mr Seed.
export const setMrSeedMode = createAction('setMrSeedMode', mode => ({ mode }));
export const makeMrSeedShakeHead = () => setMrSeedMode(seed.SMH);
export const makeMrSeedGiveThumbsUp = () => setMrSeedMode(seed.THUMBS_UP);
export const makeMrSeedListen = () => setMrSeedMode(seed.LISTENING);
export const makeMrSeedReady = () => setMrSeedMode(seed.READY);
export const makeMrSeedBloom = () => setMrSeedMode(seed.BLOOM);
export const wakeUpMrSeed = () => setMrSeedMode(seed.WAKE_UP);
export const setFlower = createAction('setFlower');
