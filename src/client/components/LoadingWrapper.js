import React from 'react';
import PropTypes from 'prop-types';

import Spinner from 'react-spinkit';

const Loading = ({ rendered, children }) =>
	!rendered ? (
		<div className="vertical-center full">
			<Spinner name="line-scale-pulse-out-rapid" color="white" />
		</div>
	) : (
		children
	);

Loading.propTypes = {
	rendered: PropTypes.bool,
	children: PropTypes.array,
};

export default Loading;
