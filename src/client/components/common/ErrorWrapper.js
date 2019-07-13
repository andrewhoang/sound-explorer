import React, { Component } from 'react';

class ErrorWrapper extends Component {
	constructor(props) {
		super(props);
	}

	componentDidCatch = () => {
		window.location.reload();
	};

	render() {
		return this.props.children;
	}
}

export default ErrorWrapper;
