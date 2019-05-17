import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import store from './store'

import { API } from 'space-api';

export const api = new API('fyp-app', 'http://localhost:8080');
export const db = api.Mongo();

// store.dispatch(connect('ws://localhost:8080/v1/json/socket', true));
ReactDOM.render(<Provider store={store} ><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
