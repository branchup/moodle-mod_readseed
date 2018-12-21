import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const rootReducer = (state = {}, action) => {
  return state;
};

function getStore(options, recorderConfig) {
  const initialState = {
    options,
    recorder: {
      config: recorderConfig
    }
  };
  return createStore(rootReducer, initialState, applyMiddleware(thunk));
}

export { getStore };
