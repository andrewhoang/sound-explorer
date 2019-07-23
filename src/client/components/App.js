import React, { Component } from 'react';
import { Switch } from 'react-router-dom';

import RouteComponent from './routes/Route';
import MainRoute from './routes/MainRoute';
import Login from './Login/Login';

import querystring from 'query-string';
import Pullable from 'react-pullable';

class App extends Component {
	state = { isAuth: false };

	componentDidMount = () => {
		let params = querystring.parse(location.search);

		if (params.access_token && params.refresh_token) {
			localStorage.setItem('access_token', params.access_token);
			localStorage.setItem('refresh_token', params.refresh_token);
		}

		let isAuth = localStorage.getItem('access_token') && localStorage.getItem('refresh_token') ? true : false;
		this.setState({ isAuth });
	};

	handleRefresh = () => {
		window.location.reload();
	};

	render = () => {
		let { isAuth } = this.state;

		return (
			<Pullable onRefresh={this.handleRefresh} spinnerColor="#FFFFFF">
				<Switch>
					{isAuth ? (
						<RouteComponent path="/" component={MainRoute} auth={isAuth} />
					) : (
						<RouteComponent exact path="/" component={Login} />
					)}
				</Switch>
			</Pullable>
		);
	};
}

export default App;
