import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { Switch, withRouter } from 'react-router-dom';

import * as userActions from '../actions/userActions';

import RouteComponent from './routes/Route';
import MainRoute from './routes/MainRoute';
import Login from './Login';

import querystring from 'query-string';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = { isAuth: false };
		autoBind(this);
	}

	componentDidMount = () => {
		let params = querystring.parse(location.search);

		if (params.access_token && params.refresh_token) {
			localStorage.setItem('access_token', params.access_token);
			localStorage.setItem('refresh_token', params.refresh_token);
		}

		let isAuth = localStorage.getItem('access_token') && localStorage.getItem('refresh_token') ? true : false;
		this.setState({ isAuth });
	};

	render() {
		let { isAuth } = this.state;

		return (
			<Switch>
				{!isAuth && <RouteComponent exact path="/" component={Login} />}
				{isAuth && <RouteComponent path="/" component={MainRoute} auth={isAuth} />}
			</Switch>
		);
	}
}

App.propTypes = {
	actions: PropTypes.object,
	user: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		state: state.reducers,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...userActions }, dispatch),
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(App)
);
