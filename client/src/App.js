import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css'
import Navbar from './components/layoult/Navbar'
import Landing from './components/layoult/Landing'
import Register from './components/auth/Register'
import Login from './components/auth/Login'

function App() {
	return (
		<div className='App'>
			<Router>
				<Navbar />
				<Route exact path='/'>
					<Landing />
				</Route>
				<section className='container'>
					<Route exact path='/register'>
						<Register />
					</Route>
					<Route exact path='/login'>
						<Login />
					</Route>
				</section>
			</Router>
		</div>
	)
}

export default App
