import React from 'react';

import 'react-table/react-table.css';

import ReactTable from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faPlus, faTrash, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import minBy from 'lodash/minBy';
import moment from 'moment';

const TrackList = ({ playlist, playing, track, onClickPlay, onClickPause, onClickAdd, onClickRemove, onClickMove }) => {
	const columns = [
		{
			accessor: 'id',
			sortable: false,
			maxWidth: 60,
			Cell: row => (
				<span style={{ color: '#999' }}>
					<FontAwesomeIcon icon={faChevronUp} onClick={() => onClickMove('up', row.value)} />
					<FontAwesomeIcon icon={faChevronDown} onClick={() => onClickMove('down', row.value)} />
				</span>
			),
		},
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
					{/* {!playing ? (
						<FontAwesomeIcon icon={faPlay} onClick={() => onClickPlay(row.original.uri, row.value)} />
					) : playing && track === row.original.uri ? (
						<FontAwesomeIcon icon={faPause} onClick={() => onClickPause(row.original.uri, row.value)} />
					) : (
						playing &&
						track !== row.original.uri && (
							<FontAwesomeIcon icon={faPlay} onClick={() => onClickPlay(row.original.uri, row.value)} />
						)
					)} */}
					<FontAwesomeIcon
						icon={faPlus}
						className="table-action"
						onClick={e => {
							e.preventDefault();
							onClickAdd(row.original);
						}}
					/>
					<FontAwesomeIcon
						icon={faTrash}
						className="table-action"
						onClick={e => {
							e.preventDefault();
							onClickRemove(row.value);
						}}
					/>
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
						background: isPlaying ? '#282828' : '#333',
						fontWeight: isPlaying ? 700 : 400,
					},
				};
			}
		},
	};

	return (
		<div className="desktop">
			<ReactTable
				data={playlist}
				columns={columns}
				className="-highlight"
				showPagination={false}
				draggable="true"
				{...playingProps}
				getTdProps={(state, rowInfo, column) => {
					return {
						onClick: () => {
							if (column.id !== 'id') {
								return !playing
									? onClickPlay(rowInfo.original.uri, rowInfo.original.id)
									: playing && track === rowInfo.original.uri
									? onClickPause(rowInfo.original.uri, rowInfo.original.id)
									: playing &&
									  track !== rowInfo.original.uri &&
									  onClickPlay(rowInfo.original.uri, rowInfo.original.id);
							} else return {};
						},
					};
				}}
			/>
		</div>
	);
};

export default TrackList;
