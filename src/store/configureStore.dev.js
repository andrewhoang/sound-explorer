import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createLogger from 'redux-logger';
import throttle from 'redux-throttle';
import createDebounce from 'redux-debounced';
import thunk from 'redux-thunk';

import reducers from '../reducers';

export default function configureStore(initialState, history) {
	const middlewareWithHistory = routerMiddleware(history);
	const logger = createLogger();

	const defaultWait = 300;
	const defaultThrottleOption = {
		leading: true,
		trailing: true,
	};
	const throttleMiddleware = throttle(defaultWait, defaultThrottleOption);
	const debounce = createDebounce();
	const middleware = [debounce, thunk, logger, middlewareWithHistory];
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
