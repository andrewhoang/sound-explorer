import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { Switch, withRouter } from 'react-router-dom';

import * as userActions from '../../actions/userActions';

import RouteComponent from './Route';
import Home from '../Home';
import Search from '../Search';
import Playlist from '../playlists/Playlist';

import queryString from 'query-string';

class MainRoute extends Component {
	constructor(props) {
		super(props);
		this.state = { isAuth: false };
		autoBind(this);
	}

	componentDidMount = () => {
		this.props.actions.getUserProfile();
	};

	render() {
		let { user } = this.props;
		let { isAuth } = this.state;
		return (
			<div>
				<Switch>
					<RouteComponent exact path="/" component={Home} user={user} auth={isAuth} />
					<RouteComponent path="/search" component={Search} user={user} auth={isAuth} />
					<RouteComponent path="/playlist" component={Playlist} user={user} auth={isAuth} />
				</Switch>
			</div>
		);
	}
}

MainRoute.propTypes = {
	user: PropTypes.object,
	actions: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		user: state.reducers.user,
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
	)(MainRoute)
);
