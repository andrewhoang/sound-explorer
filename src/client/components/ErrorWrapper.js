import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from './styled/Button';

class ErrorWrapper extends Component {
	state = { error: false };

	componentDidCatch = () => {
		this.setState({ error: true });
	};

	render() {
		const { error } = this.state;
		return error ? (
			<div className="vertical-center full">
				<h2>Something went wrong.</h2>
				<Button onClick={() => window.location.reload()}>click here to try again</Button>
			</div>
		) : (
			this.props.children
		);
	}
}

ErrorWrapper.propTypes = {
	children: PropTypes.object,
};

export default ErrorWrapper;
