import React from 'react';

import 'react-table/react-table.css';

import ReactTable from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTrash } from '@fortawesome/free-solid-svg-icons';

import minBy from 'lodash/minBy';
import moment from 'moment';

const TrackList = ({ playlist, playing, track, onClickPlay, onClickPause, onClickRemove }) => {
	const columns = [
		{
			accessor: 'album',
			sortable: false,
			maxWidth: 100,
			Cell: row => <img src={minBy(row.value.images, 'height').url} className="artist-dp" />,
		},
		{
			Header: 'Title',
			accessor: 'name',
		},
		{
			Header: 'Artist',
			accessor: 'artists',
			Cell: row => row.value.map((artist, i) => (i == 0 ? `${artist.name}` : ` ${artist.name}`)).toString(),
		},
		{
			Header: 'Album',
			accessor: 'album.name',
		},
		{
			Header: 'Duration',
			accessor: 'duration_ms',
			maxWidth: 100,
			Cell: row => moment.utc(row.value).format('mm:ss'),
		},
		{
			accessor: 'id',
			sortable: false,
			maxWidth: 80,
			Cell: row => (
				<span>
					{!playing ? (
						<FontAwesomeIcon icon={faPlay} onClick={() => onClickPlay(row.original.uri)} />
					) : playing && track === row.original.uri ? (
						<FontAwesomeIcon icon={faPause} onClick={() => onClickPause(row.original.uri)} />
					) : (
						playing &&
						track !== row.original.uri && (
							<FontAwesomeIcon icon={faPlay} onClick={() => onClickPlay(row.original.uri)} />
						)
					)}
					<FontAwesomeIcon icon={faTrash} onClick={() => onClickRemove(row.value)} />
				</span>
			),
		},
	];

	let playingProps = {
		getTrGroupProps: (state, row) => {
			if (state && row && row.original) {
				const isPlaying = playing && track === row.original.uri;
				return {
					style: {
						color: isPlaying ? '#1db954' : '#fff',
						fontWeight: isPlaying ? 700 : 400,
					},
				};
			}
		},
	};

	return (
		<ReactTable data={playlist} columns={columns} className="-highlight" showPagination={false} {...playingProps} />
	);
};

export default TrackList;
