import React, { useEffect, useState } from 'react'
import { createStore, useStore } from 'react-hookstore'

import api from '../../api/api'
import { initialState, reducer } from '../../reducers/ui'

import Controls from './Controls'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'
import { TwitchEmbed } from './twitchembed'
// import { Instructions } from './instructions'
import Footer from '../general/Footer'

const savedState = JSON.parse(window.localStorage.getItem('ui')) || {}
const combinedState = { ...initialState, ...savedState }
createStore('ui', combinedState, reducer).subscribe((state) => {
    window.localStorage.setItem('ui', JSON.stringify(state))
})

export function Caster(props) {
    const [csrf, setCsrf] = useState('')
    const [casterData, setCasterData] = useState({})
    const [myCaster, setMyCaster] = useState({})
    const [{ chats }] = useStore('ui')

    let caster = props.match.params.caster

    // get csrf
    useEffect(() => {
        api.caster.getCsrf().then((response) => {
            setCsrf(response.data.data)
        })
    }, [])

    useEffect(() => {
        // gets data for https://stream-sync/caster/{caster}
        const data = { url_path: caster }
        api.caster.get(data).then((response) => {
            setCasterData(response.data.data)
        })

        api.caster.getMyCaster().then((response) => {
            setMyCaster(response.data.data)
        })
    }, [caster])

    return (
        <div className="grid-container">
            <Controls />
            <div className="content">
                <div className="chat" open={chats.side !== ''}>
                    <TwitchChatEmbed channel={chats.side} />
                </div>
                <div className="video">
                    <YoutubeEmbed
                        caster={caster}
                        youtubeLiveUrl={casterData.youtube_url}
                        myCaster={myCaster}
                        csrf={csrf}
                    />
                </div>
                <div className="chat" open={chats.caster}>
                    <TwitchChatEmbed channel={casterData.twitch_channel} />
                </div>
            </div>
            {casterData.twitch_channel && <TwitchEmbed config={casterData} />}
            <Footer />
        </div>
    )
}
