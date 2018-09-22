import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../Home';

class RouteComponent extends Component {
	render() {
		return (
			<Switch>
				<div>
					<Route exact path="/" component={Home} />
				</div>
			</Switch>
		);
	}
}

export default RouteComponent;
