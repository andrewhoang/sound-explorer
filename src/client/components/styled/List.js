import React from 'react';
import styled from 'styled-components';
import FlipMove from 'react-flip-move';

const List = styled(FlipMove)`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	&.-column {
		grid-template-columns: 1fr;
	}

	@media screen and (max-width: 989px) {
		grid-template-columns: 1fr;
		padding: 0 10px;
		.card-detail {
			h5 {
				font-size: 0.9rem;
			}
		}
	}
`;

export default List;
