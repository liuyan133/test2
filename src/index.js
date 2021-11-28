import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './redux/store'
import {Provider} from 'react-redux'
import {BrowserRouter,Switch} from 'react-router-dom'

	ReactDOM.render(
		<Provider store={store}>
			<BrowserRouter>
				<Switch>
					<App/>
				</Switch>
			</BrowserRouter>
		</Provider>	
	,document.getElementById('root'))
	