import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { Form, Radio } from 'semantic-ui-react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

import maxBy from 'lodash/maxBy';

const PlaylistHeader = ({
	playlist,
	upload,
	isPublic,
	onChangeStatus,
	onUploadImage,
	onNamePlaylist,
	onSavePlaylist,
	savingPlaylist,
}) => {
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
					<div contentEditable="true" onBlur={onNamePlaylist}>
						Playlist
					</div>
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
				<Button onClick={onSavePlaylist}>
					<FontAwesomeIcon icon={faSpotify} />
					{savingPlaylist ? 'Saving to Spotify...' : 'Save to Spotify'}
				</Button>
				{/* <p onClick={onUploadImage}>Add Playlist Cover</p> */}
			</Col>
		</Row>
	);
};

export default PlaylistHeader;
