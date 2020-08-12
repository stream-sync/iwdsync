import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    // Link
} from 'react-router-dom'

import { Caster } from './components/caster/caster'
import './App.css'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={TempReroute} />
                <Route path="/caster/:caster" component={Caster} />
            </Switch>
        </Router>
    )
}

function TempReroute() {
    return (
        <Redirect to='/caster/iwd' />
    )
}

export default App
