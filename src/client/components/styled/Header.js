import styled from 'styled-components';

const Header = styled.div`
	height: 400px;
	background-size: cover !important;
	background-position: center 25% !important;
	background-image: ${props => props.image};
	overflow: hidden;
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	margin-left: -15px;
	margin-right: -15px;
	margin-bottom: 15px;
	position: relative;
	h1 {
		text-align: center;
		margin-bottom: 0px;
		max-width: 80vw;
		font-size: 60px;
	}
	.subtext {
		display: flex;
		justify-content: center;
		margin: 5px auto;
		font-size: 1em;
		letter-spacing: 0.1em;
		max-width: 80vw;
		opacity: 0.6;
		span {
			margin-left: 5px;
		}
	}
	&.home {
		display: block;
		overflow: visible;
		background: url('https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80');
	}
	&.custom {
		div {
			outline: none;
		}
		h1 {
			&:focus {
				outline: none !important;
			}
		}
		p {
			position: absolute;
			bottom: 0;
			right: 0;
			padding: 10px;
			font-size: 12px;
			font-weight: 700;
			text-transform: uppercase;
		}
	}
	.field {
		display: inline-block;
		padding: 0 10px;
		margin: 0 !important;
		label {
			color: #fff !important;
		}
	}

	@media screen and (max-width: 989px) {
		h1 {
			display: flex;
			align-items: center;
			font-size: 2.7em !important;
		}
		p {
			right: 20px !important;
		}
	}

	@media screen and (max-width: 400px) {
		h1 {
			display: flex;
			align-items: center;
			font-size: 2.5em !important;
		}
	}
`;

export default Header;
