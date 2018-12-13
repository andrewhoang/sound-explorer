import React, { Component } from 'react';
import Spinner from 'react-spinkit';

class Loading extends Component {
	constructor(props, context) {
		super(props, context);
	}
	render() {
		if (!this.props.rendered) {
			return (
				<div className="vertical-center">
					<Spinner name="line-scale-pulse-out-rapid" color="white" />
				</div>
			);
		}
		return this.props.children;
	}
}

export default Loading;
