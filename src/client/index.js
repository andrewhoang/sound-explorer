import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import axios from 'axios';

import userService from './services/userService';
import { register } from '../../src-sw';

import App from './components/App';
import 'animate.css';
import './assets/images';
import './assets/styles/styles.scss';

const history = createBrowserHistory();
const store = configureStore({}, history);

axios.interceptors.request.use(
	config => {
		const token = localStorage.getItem('access_token');
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	error => Promise.reject(error)
);

axios.interceptors.response.use(
	response => response,
	error => {
		if (error.response.status === 401) {
			const token = localStorage.getItem('refresh_token');
			if (token && localStorage.getItem('access_token')) {
				return userService.refreshToken(token).then(response => {
					error.config.headers['Authorization'] = `Bearer ${response.access_token}`;
					if (response.access_token) {
						return axios.request(error.config);
					} else {
						return userService.logOut();
					}
				});
			} else {
				return userService.logOut();
			}
		}
		return Promise.reject(error.response);
	}
);

register();

const AppWrapper = () => (
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<App />
		</ConnectedRouter>
	</Provider>
);

ReactDOM.render(<AppWrapper />, document.getElementById('app'));

if (module.hot) {
	module.hot.accept('./components/App', () => {
		ReactDOM.render(<AppWrapper />, document.getElementById('app'));
	});
}
