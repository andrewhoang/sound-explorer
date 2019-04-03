import React, { Component, Fragment } from 'react';
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
		this.state = { rendered: true };
		autoBind(this);
	}

	componentDidMount = () => {
		this.props.actions.getUserProfile();
		setTimeout(() => this.setState({ rendered: true }), 3500);
	};

	render() {
		return (
			<Fragment>
				<LoadingWrapper rendered={this.state.rendered}>
					<Switch>
						<RouteComponent {...this.props} exact path="/" component={Home} />
						<RouteComponent {...this.props} path="/playlist" component={PlaylistPage} />
						<RouteComponent {...this.props} path="/search" component={ArtistsPage} />
					</Switch>
				</LoadingWrapper>
			</Fragment>
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
