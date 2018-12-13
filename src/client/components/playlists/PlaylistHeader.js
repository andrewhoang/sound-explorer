import React, { Component } from 'react';
import autoBind from 'react-autobind';

import { Row, Col, Button } from 'react-bootstrap';
import { Form, Radio } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import maxBy from 'lodash/maxBy';

class PlaylistHeader extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = { new: false };
		autoBind(this);
	}

	componentDidMount() {
		let name = this.props.owner && this.props.owner.split(' ');

		this.name.focus();
		this.name.innerHTML = `${name[0]}'s Playlist`;
		var sel = window.getSelection();
		sel.collapse(this.name.firstChild, this.name.innerHTML.length);
	}

	savePlaylist = () => {
		this.props.onSavePlaylist();
		this.setState({ newPlaylist: true });
	};

	updatePlaylist = () => {
		this.props.onUpdatePlaylist();
		this.setState({ newPlaylist: false });
	};

	render() {
		let { playlist, upload, isPublic, onChangeStatus, onUploadImage, onNamePlaylist, savingPlaylist } = this.props;

		let image = upload ? upload : playlist[0] && maxBy(playlist[0].album.images, 'height').url;

		return (
			<Row>
				<Col
					md={12}
					className="header custom"
					style={{
						backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(34, 34, 34, 0.8)), url('${image}')`,
					}}
				>
					<h1>
						<div
							contentEditable="true"
							onBlur={onNamePlaylist}
							ref={input => {
								this.name = input;
							}}
						/>
					</h1>
					<Form>
						<Form.Field>
							<Radio
								label="Public"
								name="radioGroup"
								value="true"
								checked={isPublic == 'true'}
								onChange={onChangeStatus}
							/>
						</Form.Field>
						<Form.Field>
							<Radio
								label="Private"
								name="radioGroup"
								value="false"
								checked={isPublic == 'false'}
								onChange={onChangeStatus}
							/>
						</Form.Field>
					</Form>
					<div className="flex-row">
						<Button onClick={this.savePlaylist}>
							{/* <FontAwesomeIcon icon={faSpotify} /> */}
							{savingPlaylist && this.state.newPlaylist ? 'Saving to Spotify...' : 'Create Playlist'}
						</Button>
						<Button onClick={this.updatePlaylist}>
							{savingPlaylist && !this.state.newPlaylist ? 'Updating Playlist...' : 'Update Playlist'}
						</Button>
					</div>
					<p onClick={onUploadImage}>
						<FontAwesomeIcon icon={faPencilAlt} />
						Edit Cover Image
					</p>
				</Col>
			</Row>
		);
	}
}
export default PlaylistHeader;
