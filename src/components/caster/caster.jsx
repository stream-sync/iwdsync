import React, { useEffect, useState } from 'react'
import { caster_data } from '../../configs/gen'
import { TwitchEmbed } from './twitchembed'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'
import { getHeight } from '../../helper/video'
import queryString from 'query-string'

export function Caster(props) {
    const [ext_config, setExtConfig] = useState({})
    const [show_chat, setShowChat] = useState('')
    const [caster_chat, setCasterChat] = useState(true)
    const [youtube_width, setYoutubeWidth] = useState('fill with chat')
    const [twitch_width, setTwitchWidth] = useState(640)
    const [show_twitch_in_youtube, setShowTwitchInYoutube] = useState(true)
    const [window_width, setWindowWidth] = useState(window.innerWidth)
    let caster = props.match.params.caster
    const config = caster_data[caster]
    const chat_width = 300

    let chat_count = 0
    if (show_chat !== '') {
        chat_count++
    }
    if (caster_chat) {
        chat_count++
    }

    const chat_width_total = chat_count * chat_width

    let youtube_width_actual = youtube_width
    if (youtube_width === 'fill') {
        youtube_width_actual = window_width - 20
    } else if (youtube_width === 'fill with chat') {
        youtube_width_actual = window_width - chat_width_total - 20
    }

    let twitch_width_actual = twitch_width
    if (twitch_width === 'fill') {
        twitch_width_actual = window_width - 20
    } else if (twitch_width === 'fill with chat') {
        twitch_width_actual = window_width - chat_width_total - 20
    }

    const mini_twitch_width = parseInt(0.19 * youtube_width_actual)
    const mini_twitch_bottom_pos = parseInt(getHeight({ width: youtube_width_actual }) * 0.225)

    const parseData = text => {
        let dat = {}
        for (let line of text.split('\n')) {
            let [key, val] = [
                line.split('=')[0],
                line
                    .split('=')
                    .slice(1)
                    .join('='),
            ]
            key = key.trim()
            val = val.trim()
            dat[key] = val
        }
        setExtConfig(dat)
    }

    const getButtonStyle = is_selected => {
        let button_style = {
            borderStyle: 'none',
            borderRadius: 5,
            padding: 5,
            margin: 3,
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
        }
        if (is_selected) {
            button_style = {
                ...button_style,
                background: '#a43030',
            }
        } else {
            button_style = {
                ...button_style,
                background: '#4a0202',
            }
        }
        return button_style
    }

    // re-set window-width on window resize
    useEffect(() => {
        const resize_event_handler = window.addEventListener('resize', () => {
            if (window.innerWidth !== window_width) {
                setWindowWidth(window.innerWidth)
            }
        })
        return () => {
            window.removeEventListener(resize_event_handler)
        }
    }, [])

    useEffect(() => {
        const options = {
            headers: { 'Access-Control-Allow-Origin': '*' },
            origin: null,
        }
        let qs = queryString.parse(window.location.search)
        let url = undefined
        if (caster) {
            if (config.preset === undefined) {
                url = `https://cors-anywhere.herokuapp.com/${config.config_url}`
            } else {
                setExtConfig(config.preset)
            }
        } else if (qs.config) {
            if (qs.config.indexOf('/raw/') === -1) {
                let haste_id = qs.config.split('hastebin.com/')[1].split('.')[0]
                url = `https://cors-anywhere.herokuapp.com/https://hastebin.com/raw/${haste_id}`
            } else {
                url = `https://cors-anywhere.herokuapp.com/${qs.config}`
            }
        }
        if (url) {
            fetch(url, options).then(response => {
                response.text().then(text => {
                    parseData(text)
                })
            })
        }
    }, [caster, config])

    const selectable_widths = [560, 640, 720, 1280, 1600, 'fill', 'fill with chat']
    const button_group_style = {
        marginLeft: 40,
        display: 'inline-block',
    }

    return (
        <div>
            {ext_config && (
                <>
                    <h1 style={{ textAlign: 'center', marginBottom: 5 }}>{ext_config.title}</h1>

                    {/* <div style={{ textAlign: 'center' }}> */}
                    {/*     <Link to="/">go home</Link> */}
                    {/* </div> */}

                    <div style={{ ...button_group_style }}>
                        <h4>Riot Chat</h4>
                        <div style={{ display: 'inline-block' }}>
                            <button
                                style={getButtonStyle(show_chat === '')}
                                onClick={() => setShowChat('')}
                            >
                                None
                            </button>
                            <button
                                style={getButtonStyle(show_chat === 'lcs')}
                                onClick={() => setShowChat('lcs')}
                            >
                                LCS
                            </button>
                            <button
                                style={getButtonStyle(show_chat === 'lec')}
                                onClick={() => setShowChat('lec')}
                            >
                                LEC
                            </button>
                        </div>
                    </div>

                    <div style={{ ...button_group_style }}>
                        <h4>{ext_config.twitch_channel} chat</h4>
                        <div style={{ display: 'inline-block' }}>
                            <button
                                style={getButtonStyle(caster_chat === false)}
                                onClick={() => setCasterChat(false)}
                            >
                                Off
                            </button>
                            <button
                                style={getButtonStyle(caster_chat === true)}
                                onClick={() => setCasterChat(true)}
                            >
                                On
                            </button>
                        </div>
                    </div>

                    <div style={{ ...button_group_style }}>
                        <h4>Youtube Video Width</h4>
                        <div style={{ display: 'inline-block' }}>
                            {selectable_widths.map(pixel_width => {
                                return (
                                    <button
                                        key={`youtube-${pixel_width}`}
                                        style={getButtonStyle(pixel_width === youtube_width)}
                                        onClick={() => setYoutubeWidth(pixel_width)}
                                    >
                                        {pixel_width}
                                        {typeof pixel_width === 'string' ? '' : 'px'}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div style={{ ...button_group_style }}>
                        <h4>Twitch Video Style</h4>

                        <div>
                            <button
                                style={getButtonStyle(show_twitch_in_youtube === false)}
                                onClick={() => setShowTwitchInYoutube(false)}
                            >
                                Separate
                            </button>
                            <button
                                style={getButtonStyle(show_twitch_in_youtube === true)}
                                onClick={() => setShowTwitchInYoutube(true)}
                            >
                                Mini Player
                            </button>
                        </div>

                        <div>
                            {show_twitch_in_youtube === false && (
                                <>
                                    <h5>Video Size</h5>
                                    <div style={{ display: 'inline-block' }}>
                                        {selectable_widths.map(pixel_width => {
                                            return (
                                                <button
                                                    key={`twitch-${pixel_width}`}
                                                    style={getButtonStyle(
                                                        pixel_width === twitch_width,
                                                    )}
                                                    onClick={() => setTwitchWidth(pixel_width)}
                                                >
                                                    {pixel_width}
                                                    {typeof pixel_width === 'string' ? '' : 'px'}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ height: 20 }}></div>
                    <div style={{ display: 'flex', margin: 'auto', flexWrap: 'wrap' }}>
                        {show_chat !== '' && (
                            <div style={{ margin: 'auto' }}>
                                <TwitchChatEmbed
                                    width={chat_width}
                                    config={ext_config}
                                    channel={show_chat}
                                />
                            </div>
                        )}

                        <div style={{ margin: 'auto' }}>
                            {!show_twitch_in_youtube && (
                                <div>
                                    <TwitchEmbed width={twitch_width_actual} config={ext_config} />
                                </div>
                            )}

                            <div style={{ position: 'relative' }}>
                                <YoutubeEmbed
                                    width={youtube_width_actual}
                                    youtube_live_url={ext_config.youtube_live_url}
                                />

                                {show_twitch_in_youtube && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: mini_twitch_bottom_pos,
                                            right: 0,
                                            zIndex: 10,
                                            borderRadius: '5%',
                                        }}
                                    >
                                        <TwitchEmbed
                                            width={mini_twitch_width}
                                            config={ext_config}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {caster_chat && (
                            <div style={{ margin: 'auto' }}>
                                <TwitchChatEmbed width={chat_width} config={ext_config} />
                            </div>
                        )}
                    </div>

                    <div style={{ height: 200 }}></div>
                </>
            )}
        </div>
    )
}
