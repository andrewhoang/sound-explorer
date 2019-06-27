import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Notification } from 'react-notification';

class AlertMessage extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let { player } = this.props;
		let { error } = player;

		console.log(error);

		return player.error ? (
			<Notification isActive={error.status} title={error.title} message={error.message} />
		) : (
			<div />
		);
	}
}

AlertMessage.propTypes = {
	player: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		player: state.reducers.player,
	};
}

export default connect(mapStateToProps)(AlertMessage);
