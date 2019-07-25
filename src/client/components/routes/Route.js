import React from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

const RouteComponent = ({ component: Component, user, ...rest }) => {
	return <Route {...rest} render={props => <Component {...props} user={user} {...rest} />} />;
};

export default withRouter(RouteComponent);
