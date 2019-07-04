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
import 'animate.css';
import './assets/rocket.png';
import './assets/rocket-512.png';
import './assets/iphone5_splash.png';
import './assets/iphone6_splash.png';
import './assets/iphoneplus_splash.png';
import './assets/iphonex_splash.png';
import './assets/iphonexr_splash.png';
import './assets/iphonexsmax_splash.png';
import './assets/ipad_splash.png';
import './assets/ipadpro1_splash.png';
import './assets/ipadpro3_splash.png';
import './assets/ipadpro2_splash.png';

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
