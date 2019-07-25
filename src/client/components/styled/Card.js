import styled from 'styled-components';

const Card = styled.div`
	display: grid;
	grid-template-columns: 10fr auto;
	align-items: center;
	position: relative;
	border-radius: 8px;
	margin: 5px;
	padding: 10px;
	overflow: hidden;
	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.1);
		-webkit-transition: none;
		-moz-transition: none;
		transition: none;
	}
	&:hover:before {
		width: 120%;
		background-color: rgba(255, 255, 255, 0);
		-webkit-transition: all 0.5s ease-in-out;
		-moz-transition: all 0.5s ease-in-out;
		transition: all 0.5s ease-in-out;
	}
	&:hover {
		cursor: pointer;
	}
	&.-lg {
		padding: 3rem;
		grid-template-columns: 1fr !important;
		background-repeat: no-repeat !important;
		background-size: cover !important;
		background-position: center 15% !important;
		h5 {
			font-size: 2em;
		}
	}
	.card-body {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 15px;
		align-items: center;
	}
	.display-pic {
		height: 80px;
		width: 80px;
		object-fit: cover;
		border-radius: 5px;
		animation-delay: 300ms;
	}
	.card-detail {
		position: relative;
		max-width: 90%;
		overflow: hidden;
		h5 {
			font-family: 'Open Sans';
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			margin: 0;
		}
		p {
			font-size: 0.9em;
			opacity: 0.6;
			margin: 2px 0;
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
		}
	}
	.card-actions {
		z-index: 99999;
		padding: 5px;
		svg {
			&.fa-heart {
				font-size: 18px;
			}
		}
	}

	@media screen and (max-width: 989px) {
		padding: 15px;
		.display-pic {
			height: 50px;
			width: 50px;
		}
		h5 {
			font-size: 0.9rem;
		}
		p {
			font-size: 1rem;
			opacity: 0.7;
			margin: 0 !important;
		}
		.actions {
			transform: translate(-50%, -100%) !important;
			svg {
				font-size: 50px;
			}
		}
	}
`;

export default Card;
