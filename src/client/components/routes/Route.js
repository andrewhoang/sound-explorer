import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const RouteComponent = ({ component: Component, user, ...rest }) => {
	return <Route {...rest} render={props => <Component {...props} user={user} {...rest} />} />;
};

function mapStatesToProps(state) {
	return {
		state: state,
	};
}

export default withRouter(connect(mapStatesToProps)(RouteComponent));
