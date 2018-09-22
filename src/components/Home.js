import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Spinner from './Spinner';
import * as MusicActions from '../actions/MusicActions';

class Home extends Component {
	componentDidMount() {
		// this.props.actions.authorize();
	}

	render() {
		const { songs, actions } = this.props;

		return (
			<div>
				<h1>Hello</h1>
			</div>
		);
	}
}

Home.propTypes = {
	songs: PropTypes.object.isRequired,
	actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		songs: state.songs,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(MusicActions, dispatch),
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);
