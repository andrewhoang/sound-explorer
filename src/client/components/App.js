import React, { Component } from 'react';
import { Switch } from 'react-router-dom';

import RouteComponent from './routes/Route';
import MainRoute from './routes/MainRoute';
import Login from './Login/Login';

import querystring from 'query-string';
import ReactDOMServer from 'react-dom/server';
import PullToRefresh from 'pulltorefreshjs';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { isAuth: false };
	}

	componentDidMount = () => {
		let params = querystring.parse(location.search);

		if (params.access_token && params.refresh_token) {
			localStorage.setItem('access_token', params.access_token);
			localStorage.setItem('refresh_token', params.refresh_token);
		}

		let isAuth = localStorage.getItem('access_token') && localStorage.getItem('refresh_token') ? true : false;
		this.setState({ isAuth });

		// PullToRefresh.init({
		// 	mainElement: 'body',
		// 	instructionsPullToRefresh: '',
		// 	instructionsReleaseToRefresh: '',
		// 	instructionsRefreshing: '',
		// 	onRefresh() {
		// 		window.location.reload();
		// 	},
		// 	iconArrow: ReactDOMServer.renderToString(<FontAwesomeIcon icon={faSyncAlt} />),
		// 	iconRefreshing: ReactDOMServer.renderToString(<FontAwesomeIcon icon={faSyncAlt} spin={true} />),
		// });
	};

	render = () => {
		let { isAuth } = this.state;

		return (
			<Switch>
				{isAuth ? (
					<RouteComponent path="/" component={MainRoute} auth={isAuth} />
				) : (
					<RouteComponent exact path="/" component={Login} />
				)}
			</Switch>
		);
	};
}

export default App;
