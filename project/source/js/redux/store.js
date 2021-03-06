import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Router, Route, browserHistory } from 'react-router'
import { routeReducer, syncHistory } from 'react-router-redux'
import rootReducer from './modules'

export default function configureStore(initialState) {
    const store = createStore(
    	rootReducer,
    	applyMiddleware(
			thunkMiddleware // lets us dispatch() functions
		)
    )
    return store
}
