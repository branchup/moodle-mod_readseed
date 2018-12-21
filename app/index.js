import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App';
import { getStore } from './state/store';
import { setModule } from './lib/cloudpoodll';

export function init(domId, optsId, recConfigId, CloudPoodll) {
  setModule(CloudPoodll);

  const node = document.getElementById(domId);
  const opts = JSON.parse(document.getElementById(optsId).textContent);
  const recConfig = JSON.parse(document.getElementById(recConfigId).textContent);
  const store = getStore(opts, recConfig);

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    node
  );
}
