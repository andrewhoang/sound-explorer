import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import autoBind from 'react-autobind';

import * as userActions from '../actions/userActions';
import * as spotifyActions from '../actions/spotifyActions';

import background from '../assets/styles/wallpaper1.jpeg';
import 'semantic-ui-css/semantic.min.css';

import { Row, Col } from 'react-bootstrap';
import { Search } from 'semantic-ui-react';
import NewReleasesList from './NewReleasesList';
import AlertMessage from './common/Notification';

import debounce from 'lodash/debounce';
import capitalize from 'lodash/capitalize';
import uniqBy from 'lodash/uniqBy';
import minBy from 'lodash/minBy';
import Loading from './common/LoadingWrapper';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			albums: [],
			playing: false,
			progress_ms: 0,
			image: '',
			rendered: false,
		};
		autoBind(this);
	}

	componentDidMount() {
		// this.props.actions.getHeroImage();
		if (this.props.user && this.props.user.following) {
			let artists = this.props.user.following.map(artist => artist.id);
			this.props.actions.getNewReleases(artists);
		}

		// setTimeout(() => this.setState({ rendered: true }), 3500);
	}

	componentWillReceiveProps = nextProps => {
		if (nextProps.user !== this.props.user) {
			let artists = nextProps.user.following.map(artist => artist.id);
			this.props.actions.getNewReleases(artists);
		}

		if (nextProps.player !== this.props.player) {
			this.setState({ progress_ms: nextProps.player.progress_ms });
		}

		if (nextProps.image !== this.props.image) {
			this.setState({ image: nextProps.image.urls.raw });
		}
	};

	resetComponent = () => this.setState({ isLoading: false, results: false, value: '' });

	handleResultSelect = (e, { result }) => {
		this.setState({ value: result.title, selected: result });
		switch (result.type) {
			case 'artist':
				this.props.actions.getArtist(result.id);
				this.props.actions.getRelatedArtists(result.id);
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
		this.setState({ isLoading: true, results: false, value });

		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetComponent();

			let artists = uniqBy(
				this.props.results[0].artists.items
					.filter(artist => minBy(artist.images, 'height'))
					.map(artist => ({
						type: 'artist',
						id: artist.id,
						title: artist.name,
						image: minBy(artist.images, 'height').url,
						description: artist.genres
							.slice(0, 3)
							.map((genre, i) => (i == 0 ? `${capitalize(genre)}` : ` ${capitalize(genre)}`))
							.toString(),
					})),
				'title'
			);

			let tracks = uniqBy(
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

			let categories = {};
			artists.length &&
				(categories['artists'] = {
					name: 'Artists',
					results: artists,
				});
			tracks.length &&
				(categories['tracks'] = {
					name: 'Tracks',
					results: tracks,
				});

			this.setState({
				isLoading: false,
				results: categories,
			});
		}, 800);
	};

	handlePlay = track => {
		let progress_ms = track == this.state.track ? this.state.progress_ms : 0;
		this.setState({ playing: true, track });
		this.props.actions.playTrack(track, progress_ms, true);
	};

	handlePause = track => {
		this.setState({ playing: false, track });
		this.props.actions.pauseTrack(track);
	};

	render() {
		const { albums, user } = this.props;
		const { value, results, isLoading, playing, track, image } = this.state;

		return (
			<div>
				<AlertMessage />
				<div className="container animated fadeIn">
					<Row>
						<Col
							md={12}
							className="home header"
							style={{
								background: `url(${image || background})`,
							}}
						>
							<Search
								category
								// open={true}
								loading={isLoading}
								placeholder="Search by favorite artist or track"
								onResultSelect={this.handleResultSelect}
								onSearchChange={debounce(this.handleSearchChange, 3000, { leading: true })}
								results={results}
								value={value}
							/>
						</Col>
					</Row>
					<Row>
						<NewReleasesList
							albums={albums}
							onClickPlay={this.handlePlay}
							onClickPause={this.handlePause}
							track={track}
							playing={playing}
							isPremium={user.product == 'premium'}
						/>
					</Row>
				</div>
			</div>
		);
	}
}

Home.propTypes = {
	songs: PropTypes.object,
	actions: PropTypes.object,
	results: PropTypes.array,
};

function mapStateToProps(state) {
	return {
		results: state.reducers.results,
		albums: state.reducers.albums,
		image: state.reducers.image,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators({ ...userActions, ...spotifyActions }, dispatch),
	};
}

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Home)
);