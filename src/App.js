import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    // Link
} from 'react-router-dom'
import { Caster } from './components/caster/caster'

function App() {
    return (
        <div>
            <Router>
                <div>
                    <Switch>
                        {/* <Route path="/"> */}
                        {/*   <Home /> */}
                        {/* </Route> */}
                        <Route path="/caster/:caster" component={Caster} />
                    </Switch>

                    <div style={{ paddingLeft: 15, color: 'grey' }}>
                        <div>
                            Written by <a href="https://brianperrett.com/">Brian</a>
                        </div>
                        <div style={{ height: 20 }}></div>
                    </div>
                </div>
            </Router>
        </div>
    )
}

export default App
