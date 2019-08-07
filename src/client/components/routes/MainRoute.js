import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Switch, withRouter } from 'react-router-dom';

import * as userActions from '../../actions/userActions';

import RouteComponent from './Route';
import Home from '../Home';
import ArtistsPage from '../artists/ArtistsPage';
import PlaylistPage from '../playlists/PlaylistPage';
import AudioPlayer from '../AudioPlayer';
import AlertMessage from '../common/Notification';

import windowSize from 'react-window-size';

class MainRoute extends Component {
	componentDidMount = () => {
		this.props.actions.getUserProfile();
	};

	render = () => {
		let { user, windowWidth } = this.props;

		return (
			<>
				<AlertMessage />
				<Switch>
					<RouteComponent user={user} isMobile={windowWidth < 768} exact path="/" component={Home} />
					<RouteComponent user={user} isMobile={windowWidth < 767} path="/search" component={ArtistsPage} />
					<RouteComponent
						user={user}
						isMobile={windowWidth < 767}
						path="/playlist"
						component={PlaylistPage}
					/>
				</Switch>
				<AudioPlayer />
			</>
		);
	};
}

MainRoute.propTypes = {
	actions: PropTypes.object,
	user: PropTypes.object,
};

function mapStateToProps(state) {
	return {
		user: state.reducers.user,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...userActions }, dispatch),
	};
}

export default windowSize(
	withRouter(
		connect(
			mapStateToProps,
			mapDispatchToProps
		)(MainRoute)
	)
);
