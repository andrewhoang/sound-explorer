import styled from 'styled-components';

const Container = styled.div`
	width: 100vw;
	overflow-y: scroll;
	background: #1a1a1a;
	padding: 0 10px;
	padding-bottom: ${props => (props.player ? '60px' : '20px')};
	&::-webkit-scrollbar {
		width: 0px;
	}

	@media screen and (min-width: 990px) {
		overflow-x: hidden;
	}

	@media screen and (max-width: 989px) {
		width: 100vw !important;
		max-width: unset !important;
		overflow-x: hidden;
		padding-left: 0;
		padding-right: 0;
		padding-bottom: ${props => (props.player ? '50px' : '20px')};
		-webkit-overflow-scrolling: touch;
		h6 {
			display: block !important;
			white-space: nowrap;
			margin: 0 auto;
			text-overflow: ellipsis !important;
			overflow: hidden;
		}
	}
`;

export default Container;
