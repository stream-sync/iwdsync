import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    // Link
} from 'react-router-dom'
import { Caster } from './components/caster/caster'
// import { Home } from './components/general/Home'
import './App.css'

function App() {
    return (
        <div>
            <Router>
                <div>
                    <Switch>

                        <Route path="/" exact component={TempReroute} />
                        <Route path="/caster/:caster" component={Caster} />
                        {/* <Route path="/config" component={Caster} /> */}
                    </Switch>

                </div>
            </Router>
        </div>
    )
}

function TempReroute() {
    return (
        <Redirect to='/caster/iwd' />
    )
}

export default App
