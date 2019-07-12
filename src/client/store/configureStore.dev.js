import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
import createDebounce from 'redux-debounced';
import thunk from 'redux-thunk';
import throttle from 'redux-throttle';

import reducers from '../reducers';

export default function configureStore(initialState, history) {
	const middlewareWithHistory = routerMiddleware(history);
	const logger = createLogger();
	const debounce = createDebounce();

	const defaultWait = 3000;
	const defaultThrottleOption = {
		leading: true,
		trailing: false,
	};

	const throttleMiddleware = throttle(defaultWait, defaultThrottleOption);
	const middleware = [throttleMiddleware, debounce, thunk, logger, middlewareWithHistory];
	const reducer = combineReducers({
		reducers,
		routing: routerReducer,
	});

	const store = createStore(reducer, initialState, compose(applyMiddleware(...middleware)));

	if (module.hot) {
		module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers').default));
	}

	return store;
}
