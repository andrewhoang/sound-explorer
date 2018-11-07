import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import axios from 'axios';

import userService from './services/userService';

import App from './components/App';
import './assets/styles/styles.scss';
import './assets/favicon-rocket.ico';

const history = createHistory();
const store = configureStore({}, history);

axios.interceptors.request.use(
	config => {
		if (!config.url.includes('unsplash')) {
			const token = localStorage.getItem('access_token');
			config.headers.Authorization = `Bearer ${token}`;
		}
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

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<App />
		</ConnectedRouter>
	</Provider>,
	document.getElementById('app')
);

if (module.hot) {
	module.hot.accept('./components/App', () => {
		ReactDOM.render(
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<App />
				</ConnectedRouter>
			</Provider>,
			document.getElementById('app')
		);
	});
}
