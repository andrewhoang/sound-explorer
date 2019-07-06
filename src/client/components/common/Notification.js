import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Notification } from 'react-notification';

class AlertMessage extends Component {
	constructor(props) {
		super(props);
		this.state = { active: false };
	}

	componentWillReceiveProps = nextProps => {
		if (nextProps.player !== this.props.player) {
			this.setState({ active: nextProps.player.error.status }, () =>
				setTimeout(() => this.setState({ active: false }), 5000)
			);
		}
	};

	render() {
		let { player } = this.props;
		let { error } = player;

		return (
			<Notification
				isActive={this.state.active}
				title={error ? error.title : ''}
				message={error ? error.message : ''}
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
