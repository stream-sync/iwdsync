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
                <Route path="/" exact component={() => <Redirect to="/caster/iwd" />} />
                <Route path="/caster/:caster" component={Caster} />
            </Switch>
        </Router>
    )
}

export default App
