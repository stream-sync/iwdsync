import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'

export function UseConfig(props) {
    const [do_redirect, setDoRedirect] = useState(false)
    const [config_url, setConfigUrl] = useState('')

    if (do_redirect) {
        return <Redirect to={`/config?config=${config_url}`} />
    } else {
        return (
            <div style={{ margin: 'auto', maxWidth: 400 }}>
                <h3>Use a Pre-created Config</h3>
                <ul>
                    <li>
                        Paste your hastebin link here.
                    </li>
                    <li>
                        Click button
                    </li>
                </ul>
                <input
                    type="text"
                    value={config_url}
                    onChange={event => setConfigUrl(event.target.value)}
                />

                <button onClick={() => setDoRedirect(true)}>go to multistream</button>
            </div>
        )
    }
}
