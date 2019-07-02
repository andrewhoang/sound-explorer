import React from 'react';
import Spinner from 'react-spinkit';

const Loading = ({ rendered, children }) =>
	!rendered ? (
		<div className="vertical-center full">
			<Spinner name="line-scale-pulse-out-rapid" color="white" />
		</div>
	) : (
		children
	);

export default Loading;
