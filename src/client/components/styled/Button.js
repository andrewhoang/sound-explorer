import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import styled from 'styled-components';

const ButtonStyles = styled(Button)`
	display: block;
	background: #1db954;
	font-family: 'Open Sans';
	color: #fff !important;
	padding: 15px 30px;
	margin: 20px auto;
	font-weight: 700;
	text-transform: uppercase !important;
	outline: none !important;
	border: 0;
	&:focus,
	&:hover {
		background: #178f41 !important;
		color: #fff !important;
		transition: background 500ms;
	}

	@media screen and (max-width: 989px) {
		font-size: 0.9rem !important;
	}
`;

export default ButtonStyles;
