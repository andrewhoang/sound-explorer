import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as userActions from '../actions/userActions';
import * as spotifyActions from '../actions/spotifyActions';

import 'semantic-ui-css/semantic.min.css';

import Container from './styled/Container';
import NewReleasesList from './NewReleasesList';
import RecommendedList from './RecommendedList';
import Loading from './LoadingWrapper';
import Header from './styled/Header';
import { Search } from 'semantic-ui-react';

import uniqBy from 'lodash/uniqBy';
import minBy from 'lodash/minBy';

class Home extends Component {
	state = { rendered: false };

	componentDidMount = () => {
		const { user } = this.props;
		if (user && user.following) {
			const artists = user.following.map(artist => artist.id);
			this.props.actions.getNewReleases(artists);
		}

		this.props.actions.getRecommendedTracks();
		setTimeout(() => this.setState({ rendered: true }), 3500);
	};

	componentWillReceiveProps = nextProps => {
		const { user, player } = nextProps;
		if (user !== this.props.user) {
			const artists = user.following.map(artist => artist.id);
			this.props.actions.getNewReleases(artists);
		}

		if (player !== this.props.player) {
			this.setState({ progress_ms: player.progress_ms });
		}
	};

	resetComponent = () => this.setState({ loading: false, results: false, value: '' });

	handleResultSelect = (e, { result }) => {
		this.setState({ value: result.title, selected: result });
		switch (result.type) {
			case 'artist':
				this.props.history.push(`/search?${result.type}=${result.id}`);
				break;
			case 'track':
				this.props.history.push(`/playlist`);
				this.props.actions.getTrack(result.id);
				this.props.actions.createPlaylist('track', result.id);
				break;
		}
	};

	handleSearchChange = (e, { value }) => {
		value && this.props.actions.search(['artist', 'track'], value);
		this.setState({ loading: true, value });

		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetComponent();

			const artists = uniqBy(
				this.props.results[0].artists.items
					.filter(artist => minBy(artist.images, 'height'))
					.map(artist => ({
						type: 'artist',
						id: artist.id,
						title: artist.name,
						image: minBy(artist.images, 'height').url,
						description: artist.genres
							.slice(0, 3)
							.map((genre, i) => (i == 0 ? `${genre}` : ` ${genre}`))
							.toString(),
					})),
				'title'
			);

			const tracks = uniqBy(
				this.props.results[1].tracks.items
					.filter(track => minBy(track.album.images, 'height'))
					.map(track => ({
						type: 'track',
						id: track.id,
						title: track.name,
						image: minBy(track.album.images, 'height').url,
						description: track.artists
							.map((artist, i) => (i == 0 ? artist.name : ` ${artist.name}`))
							.toString(),
					})),
				'title'
			);

			const categories = {
				...(artists.length && {
					artists: {
						name: 'Artists',
						results: artists,
					},
				}),
				...(tracks.length && {
					tracks: {
						name: 'Tracks',
						results: tracks,
					},
				}),
			};

			this.setState({ loading: false, results: categories });
		}, 800);
	};

	handlePlay = (track, id) => {
		let progress_ms = track == this.state.track ? this.state.progress_ms : 0;
		this.setState({ track });
		this.props.actions.playTrack(track, id, progress_ms);
	};

	handlePause = track => {
		this.setState({ track });
		this.props.actions.pauseTrack();
	};

	render = () => {
		const { albums, tracks, user, player, isMobile } = this.props;
		const { value, results, loading, rendered, track } = this.state;

		const spotifyProps = {
			onClickPlay: this.handlePlay,
			onClickPause: this.handlePause,
			onClickLike: this.props.actions.addToLibrary,
			showError: this.props.actions.showAlert,
			track: track,
			playing: player.playing,
			isPremium: user.product == 'premium',
		};

		return (
			<Loading rendered={rendered}>
				<Container className="animated fadeIn" player={player.track}>
					<Header className="home">
						<Search
							category
							// open={true}
							loading={loading}
							placeholder="Search by favorite artist or track"
							onResultSelect={this.handleResultSelect}
							onSearchChange={this.handleSearchChange}
							results={results}
							value={value}
						/>
					</Header>
					<div id="home-grid">
						<NewReleasesList albums={albums} user={user} isMobile={isMobile} {...spotifyProps} />
						<RecommendedList tracks={tracks} {...spotifyProps} />
					</div>
				</Container>
			</Loading>
		);
	};
}

Home.propTypes = {
	actions: PropTypes.object,
	track: PropTypes.object,
	tracks: PropTypes.array,
	albums: PropTypes.array,
	results: PropTypes.array,
	player: PropTypes.object,
};

const mapStateToProps = state => ({
	results: state.reducers.results,
	albums: state.reducers.albums,
	track: state.reducers.track,
	tracks: state.reducers.recommendedTracks,
	player: state.reducers.player,
});

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators({ ...userActions, ...spotifyActions }, dispatch),
});

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Home)
);
