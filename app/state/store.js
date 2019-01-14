import { createStore, applyMiddleware } from 'redux';
import { handleActions } from 'redux-actions';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import * as actions from './actions';
import * as seed from '../lib/seed';

const actionsReducer = handleActions(
  {
    [actions.submissionSubmitted]: (state, action) => {
      return {
        ...state,
        submissionSubmitted: true,
        attemptId: action.payload.attemptId
      };
    },
    [actions.setFlower]: (state, action) => ({
      ...state,
      flower: action.payload
    })
  },
  {}
);

const quizReducer = handleActions(
  {
    [actions.setCurrentQuestionNumber]: (state, action) => ({
      ...state,
      currentQuestionNumber: action.payload.questionNumber
    }),
    [actions.setQuestionAnswer]: (state, action) => ({
      ...state,
      answers: {
        ...state.answers,
        [action.payload.questionNumber]: action.payload.answerIndex
      }
    })
  },
  {}
);

const mrSeedInitialState = {
  mode: seed.READY
};

const mrSeedReducer = handleActions(
  {
    [actions.setMrSeedMode]: (state, action) => ({ ...state, mode: action.payload.mode })
  },
  mrSeedInitialState
);

const rootReducer = (state = {}, action) => {
  state = actionsReducer(state, action);
  state = {
    ...state,
    quiz: {
      ...quizReducer(state.quiz, action)
    },
    mrseed: {
      ...mrSeedReducer(state.mrseed, action)
    }
  };
  return state;
};

function getStore(options, recorderConfig) {
  const initialState = {
    options,
    recorder: {
      config: recorderConfig
    },
    attemptId: options.attemptid ? options.attemptid : null,
    flower: options.flower,
    submissionSubmitted: false,
    quiz: {
      currentQuestionNumber: null,
      answers: {}
    },
    mrseed: mrSeedInitialState
  };
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
  // return createStore(rootReducer, initialState, applyMiddleware(thunk, createLogger()));
}

export { getStore };
