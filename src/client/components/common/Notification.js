import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as spotifyActions from '../../actions/spotifyActions';

import { Notification } from 'react-notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

import isEmpty from 'lodash/isEmpty';

class AlertMessage extends Component {
	state = { active: false, alert: {} };

	componentWillReceiveProps = nextProps => {
		if (nextProps.alert !== this.props.alert) {
			this.setState({ alert: nextProps.alert, active: !isEmpty(nextProps.alert) ? true : false }, () => {
				if (this.state.active) {
					setTimeout(() => this.hideAlert(), 8000);
				}
			});
		}
	};

	hideAlert = () => {
		this.setState({ active: false });
		this.props.actions.hideAlert();
	};

	handleClick = () => {
		let { alert } = this.state;
		if (alert.link) {
			window.location = alert.link;
		} else {
			this.hideAlert();
		}
	};

	render() {
		let { alert } = this.state;
		return !isEmpty(alert) ? (
			<div onClick={this.handleClick}>
				<Notification
					isActive={this.state.active}
					title={<FontAwesomeIcon icon={alert.status == 'error' ? faExclamationCircle : faCheckCircle} />}
					message={
						<>
							<strong>{alert.title}</strong>
							<p>{alert.message}</p>
						</>
					}
				/>
			</div>
		) : (
			<div />
		);
	}
}

AlertMessage.propTypes = {
	alert: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		alert: state.reducers.alert,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...spotifyActions }, dispatch),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AlertMessage);
