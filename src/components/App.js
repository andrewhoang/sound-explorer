import React, { Component } from 'react';
import Route from './routes/Route';

import autoBind from 'react-autobind';

class App extends Component {
	render() {
		return (
			<div className="container">
				<Route />
			</div>
		);
	}
}

export default App;
