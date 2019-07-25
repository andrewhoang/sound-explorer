import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Header from '../styled/Header';
import Button from '../styled/Button';
import { Form, Radio } from 'semantic-ui-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import maxBy from 'lodash/maxBy';

const PlaylistHeader = ({
	playlist,
	owner,
	upload,
	isPublic,
	onChangeStatus,
	onUploadImage,
	onNamePlaylist,
	onSavePlaylist,
	onUpdatePlaylist,
	savingPlaylist,
}) => {
	const title = useRef('name');

	const [isNew, setIsNew] = useState(null);

	useEffect(() => {
		let name = owner && owner.split(' ');
		title.current.focus();
		if (name) title.current.innerHTML = `${name[0]}'s Playlist`;
		var sel = window.getSelection();
		sel.collapse(title.current.firstChild, title.current.innerHTML.length);
	}, []);

	const savePlaylist = () => {
		setIsNew(true);
		onSavePlaylist();
	};

	const updatePlaylist = () => {
		setIsNew(false);
		onUpdatePlaylist();
	};

	let image = upload ? upload : playlist[0] && maxBy(playlist[0].album.images, 'height').url;

	return (
		<Header
			className="custom"
			image={`linear-gradient(rgba(0, 0, 0, 0.8), rgba(34, 34, 34, 0.8)), url('${image}')`}
		>
			<h1>
				<div contentEditable="true" onBlur={onNamePlaylist} ref={title} />
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
			<div className="flex -row">
				<Button onClick={savePlaylist}>
					{savingPlaylist && isNew ? 'Saving to Spotify...' : 'Create Playlist'}
				</Button>
				<Button onClick={updatePlaylist}>
					{savingPlaylist && !isNew ? 'Adding to Playlist...' : 'Add To Playlist'}
				</Button>
			</div>
			<p onClick={onUploadImage}>
				<FontAwesomeIcon icon={faPencilAlt} />
				Edit Cover Image
			</p>
		</Header>
	);
};

PlaylistHeader.propTypes = {
	playlist: PropTypes.array,
	owner: PropTypes.string,
	upload: PropTypes.string,
	isPublic: PropTypes.string,
	onChangeStatus: PropTypes.func,
	onUploadImage: PropTypes.func,
	onNamePlaylist: PropTypes.func,
	onSavePlaylist: PropTypes.func,
	onUpdatePlaylist: PropTypes.func,
	savingPlaylist: PropTypes.bool,
};

export default PlaylistHeader;
