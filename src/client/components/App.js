import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';

import RouteComponent from './routes/Route';
import MainRoute from './routes/MainRoute';
import Login from './login/LoginPage';
import ErrorWrapper from './ErrorWrapper';

import querystring from 'query-string';
import Pullable from 'react-pullable';

class App extends Component {
	state = { isAuth: false };

	componentDidMount = () => {
		const { access_token, refresh_token } = querystring.parse(location.search);

		if (access_token && refresh_token) {
			localStorage.setItem('access_token', access_token);
			localStorage.setItem('refresh_token', refresh_token);
		}

		const isAuth = localStorage.getItem('access_token') && localStorage.getItem('refresh_token') ? true : false;
		this.setState({ isAuth });
	};

	handleRefresh = () => {
		window.location.reload();
	};

	render() {
		const { isAuth } = this.state;
		return (
			<Pullable onRefresh={this.handleRefresh} spinnerColor="#FFFFFF">
				<ErrorWrapper>
					<Switch>
						{isAuth ? (
							<RouteComponent path="/" component={MainRoute} auth={isAuth} />
						) : (
							<RouteComponent exact path="/" component={Login} />
						)}
					</Switch>
				</ErrorWrapper>
			</Pullable>
		);
	}
}

export default hot(App);
