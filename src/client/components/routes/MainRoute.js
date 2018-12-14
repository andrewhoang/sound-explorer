import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { Switch, withRouter } from 'react-router-dom';

import * as userActions from '../../actions/userActions';

import RouteComponent from './Route';
import Home from '../Home';
import ArtistsPage from '../artists/ArtistsPage';
import PlaylistPage from '../playlists/PlaylistPage';
import LoadingWrapper from '../common/LoadingWrapper';

class MainRoute extends Component {
	constructor(props) {
		super(props);
		this.state = { rendered: false };
		autoBind(this);
	}

	componentDidMount = () => {
		this.props.actions.getUserProfile();
		setTimeout(() => this.setState({ rendered: true }), 3500);
	};

	render() {
		let { user } = this.props;

		return (
			<div>
				<LoadingWrapper rendered={this.state.rendered}>
					<Switch>
						<RouteComponent exact path="/" component={Home} user={user} />
						<RouteComponent path="/search" component={ArtistsPage} user={user} />
						<RouteComponent path="/playlist" component={PlaylistPage} user={user} />
					</Switch>
				</LoadingWrapper>
			</div>
		);
	}
}

MainRoute.propTypes = {
	user: PropTypes.object,
	actions: PropTypes.object,
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

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(MainRoute)
);
