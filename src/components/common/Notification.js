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

		return (
			<Notification
				isActive={player.error}
				title={'Player not Found!'}
				message={'Please open up Spotify to continue.'}
			/>
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
