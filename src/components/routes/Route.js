import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const RouteComponent = ({ component: Component, user, auth, ...rest }) => (
	<Route {...rest} render={props => <Component {...props} user={user} auth={auth} />} />
);

function mapStatesToProps(state) {
	return {
		state: state,
	};
}

export default withRouter(connect(mapStatesToProps)(RouteComponent));
