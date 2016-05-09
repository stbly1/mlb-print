import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, Link, browserHistory, hashHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

import configureStore from './redux/store'

import App from './containers/App'

//import configureStore from './store/configureStore'
//import * as actions from './actions/index'

const store = configureStore();

var historyType = process.env.NODE_ENV === 'development' ? browserHistory : hashHistory;

const history = syncHistoryWithStore(historyType, store)

// store.dispatch(fetchPlayers(store.getState()))
	// .then( (res) => {
		render(
			<Provider store={store}>
				<Router history={history}>
					<Route name='app' path="/" component={App}>
					</Route>
				</Router>
			</Provider>,
			document.getElementById('root')
		)
	// })

						// <Route path='box-score-search' component={BoxScoreSearch} />