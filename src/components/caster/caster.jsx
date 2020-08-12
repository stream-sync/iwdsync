import React, { useEffect, useState, useCallback } from 'react'

import api from '../../api/api'
import { useLocalStorage } from '../../helper/hooks'
import { getHeight, getWidth } from '../../helper/video'

import { TwitchEmbed } from './twitchembed'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'
import { Instructions } from './instructions'
import Footer from '../general/Footer'

export function Caster(props) {
    // const [ext_config, setExtConfig] = useState({})
    const [csrf, setCsrf] = useState('')
    const [custom_chat, setCustomChat] = useLocalStorage('custom_chat', '')
    const [caster_data, setCasterData] = useState({})
    const [my_caster, setMyCaster] = useState({})
    const [show_chat, setShowChat] = useLocalStorage('show_chat', '')
    const [caster_chat, setCasterChat] = useLocalStorage('caster_chat', true)
    const [youtube_width, setYoutubeWidth] = useLocalStorage('youtube_width', 'fill with chat')
    const [twitch_width, setTwitchWidth] = useLocalStorage('twitch_width', 640)
    const [twitch_style, setTwitchStyle] = useLocalStorage('twitch_style', 'above_chat')
    const [mini_position, setMiniPosition] = useLocalStorage('mini_position', 'right')
    const [window_width, setWindowWidth] = useState(window.innerWidth)
    const [window_height, setWindowHeight] = useState(window.innerHeight)
    const [hide_settings, setHideSettings] = useLocalStorage('hide_settings', false)

    let caster = props.match.params.caster
    const chat_width = 300

    // get csrf
    useEffect(() => {
        api.caster.getCsrf().then((response) => {
            setCsrf(response.data.data)
        })
    }, [])

    useEffect(() => {
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
            <div className="header-menu"></div>
            <div className="content">
                <div className="chat"></div>
                <div className="video">
                    <YoutubeEmbed
                        caster={caster}
                        youtube_live_url={caster_data.youtube_url}
                        my_caster={my_caster}
                        csrf={csrf}
                    />
                </div>
                <div className="chat" open={true}>
                    <TwitchChatEmbed config={caster_data} channel={show_chat} />
                </div>
            </div>
            <Footer />
        </div>
    )
}
