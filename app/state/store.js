import { createStore, applyMiddleware } from 'redux';
import { handleActions } from 'redux-actions';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import * as actions from './actions';
import * as seed from '../lib/seed';

const actionsReducer = handleActions(
  {
    [actions.setCurrentQuestionNumber]: (state, action) => ({
      ...state,
      currentQuestionNumber: action.payload.questionNumber
    }),
    [actions.submissionSubmitted]: (state, action) => {
      return {
        ...state,
        submissionSubmitted: true,
        attemptId: action.payload.attemptId
      };
    }
  },
  {}
);

const mrSeedInitialState = {
  mode: seed.SLEEPING
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
    attemptId: null,
    submissionSubmitted: false,
    currentQuestionNumber: null,
    mrseed: mrSeedInitialState
  };
  return createStore(rootReducer, initialState, applyMiddleware(thunk, createLogger()));
}

export { getStore };
