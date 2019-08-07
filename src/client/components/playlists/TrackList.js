import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ReactTable from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import 'react-table/react-table.css';

import minBy from 'lodash/minBy';
import moment from 'moment';

const TrackList = ({
	playlist,
	playing,
	track,
	isPremium,
	onClickPlay,
	onClickPause,
	onClickAdd,
	onClickRemove,
	onClickMove,
	onSortChange,
}) => {
	const columns = [
		{
			accessor: 'id',
			sortable: false,
			maxWidth: 60,
			Cell: row => (
				<>
					<FontAwesomeIcon icon={faChevronUp} onClick={() => onClickMove('up', row.value)} />
					<FontAwesomeIcon icon={faChevronDown} onClick={() => onClickMove('down', row.value)} />
				</>
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
			Cell: row => moment(row.value).format('mm:ss'),
		},
		{
			accessor: 'id',
			sortable: false,
			maxWidth: 80,
			Cell: row => (
				<>
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
				</>
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
		<ReactTable
			data={playlist}
			columns={columns}
			showPagination={false}
			onSortedChange={onSortChange}
			resizable={false}
			draggable="true"
			{...playingProps}
			getTdProps={(state, rowInfo, column) => {
				return {
					onClick: () => {
						if (isPremium && column.id !== 'id') {
							return !playing
								? onClickPlay(rowInfo.original.uri, rowInfo.original.id)
								: playing && track === rowInfo.original.uri
								? onClickPause(rowInfo.original.uri, rowInfo.original.id)
								: playing &&
								  track !== rowInfo.original.uri &&
								  onClickPlay(rowInfo.original.uri, rowInfo.original.id);
						}
					},
				};
			}}
		/>
	);
};

TrackList.propTypes = {
	playlist: PropTypes.array,
	playing: PropTypes.bool,
	track: PropTypes.string,
	isPremium: PropTypes.bool,
	onClickPlay: PropTypes.func,
	onClickPause: PropTypes.func,
	onClickAdd: PropTypes.func,
	onClickRemove: PropTypes.func,
	onClickMove: PropTypes.func,
};

export default TrackList;
