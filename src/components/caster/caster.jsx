import React, { useEffect, useState } from 'react'

import api from '../../api/api'
// import { getHeight, getWidth } from '../../helper/video'

// import { TwitchEmbed } from './twitchembed'
import Controls from './Controls'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'
// import { Instructions } from './instructions'
import Footer from '../general/Footer'

export function Caster(props) {
    const [csrf, setCsrf] = useState('')
    const [casterData, setCasterData] = useState({})
    const [myCaster, setMyCaster] = useState({})

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
                <div className="chat" open={true}>
                    <TwitchChatEmbed channel="lcs" />
                </div>
                <div className="video">
                    <YoutubeEmbed
                        caster={caster}
                        youtubeLiveUrl={casterData.youtube_url}
                        myCaster={myCaster}
                        csrf={csrf}
                    />
                </div>
                <div className="chat" open={true}>
                    <TwitchChatEmbed channel={casterData.twitch_channel} />
                </div>
            </div>
            <Footer />
        </div>
    )
}
