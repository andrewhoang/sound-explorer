import React, { useState, useEffect } from 'react';
import { Switch } from 'react-router-dom';

import RouteComponent from './routes/Route';
import MainRoute from './routes/MainRoute';
import Login from './login/LoginPage';
import ErrorWrapper from './ErrorWrapper';

import querystring from 'query-string';
import Pullable from 'react-pullable';

const App = () => {
	const [isAuth, setAuth] = useState(
		localStorage.getItem('access_token') && localStorage.getItem('refresh_token') ? true : false
	);

	useEffect(() => {
		const { access_token, refresh_token } = querystring.parse(location.search);

		if (access_token && refresh_token) {
			localStorage.setItem('access_token', access_token);
			localStorage.setItem('refresh_token', refresh_token);
		}

		const isAuth = localStorage.getItem('access_token') && localStorage.getItem('refresh_token') ? true : false;
		setAuth(isAuth);
	}, []);

	const handleRefresh = () => {
		window.location.reload();
	};

	return (
		<Pullable onRefresh={handleRefresh} spinnerColor="#FFFFFF">
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
};

export default App;
