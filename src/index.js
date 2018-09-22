import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';

import { ConnectedRouter } from "react-router-redux";
import createHistory from "history/createBrowserHistory";

import App from './components/App';
import './styles/styles.scss';

const history = createHistory();
const store = configureStore({}, history);

ReactDOM.render(
  <Provider store={store}>
      <ConnectedRouter history={history}>
      <App/>
      </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
