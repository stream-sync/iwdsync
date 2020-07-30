import React, { useEffect, useState } from 'react'
import { useLocalStorage } from '../../helper/hooks'
// import { caster_data } from '../../configs/gen'
import { TwitchEmbed } from './twitchembed'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'
import { getHeight } from '../../helper/video'
import { Instructions } from './instructions'
// import queryString from 'query-string'
import api from '../../api/api'

export function Caster(props) {
    // const [ext_config, setExtConfig] = useState({})
    const [csrf, setCsrf] = useState('')
    const [caster_data, setCasterData] = useState({})
    const [my_caster, setMyCaster] = useState({})
    const [show_chat, setShowChat] = useLocalStorage('show_chat', '')
    const [caster_chat, setCasterChat] = useLocalStorage('caster_chat', true)
    const [youtube_width, setYoutubeWidth] = useLocalStorage('youtube_width', 'fill with chat')
    const [twitch_width, setTwitchWidth] = useLocalStorage('twitch_width', 640)
    const [show_twitch_in_youtube, setShowTwitchInYoutube] = useLocalStorage(
        'show_twitch_in_youtube',
        true,
    )
    const [mini_position, setMiniPosition] = useLocalStorage('mini_position', 'right')
    const [window_width, setWindowWidth] = useState(window.innerWidth)

    let caster = props.match.params.caster
    const chat_width = 300

    // get csrf
    useEffect(() => {
        api.caster.getCsrf().then(response => {
            setCsrf(response.data.data)
        })
    }, [])

    useEffect(() => {
        const data = { url_path: caster }
        api.caster.get(data).then(response => {
            setCasterData(response.data.data)
        })

        api.caster.getMyCaster().then(response => {
            setMyCaster(response.data.data)
        })
    }, [caster])

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
        youtube_width_actual = window_width - chat_width_total - 25
    }

    let twitch_width_actual = twitch_width
    if (twitch_width === 'fill') {
        twitch_width_actual = window_width - 20
    } else if (twitch_width === 'fill with chat') {
        twitch_width_actual = window_width - chat_width_total - 25
    }

    let mini_twitch_width = parseInt(0.18 * youtube_width_actual)
    let mini_twitch_bottom_pos = parseInt(getHeight({ width: youtube_width_actual }) * 0.415)
    if (mini_position === 'center') {
        mini_twitch_bottom_pos = getHeight({ width: youtube_width_actual }) / 2
        // getHeight({ width: mini_twitch_width }) / 2
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
            window.removeEventListener('resize', resize_event_handler)
        }
    }, [window_width])

    const selectable_widths = [560, 640, 720, 1280, 1600, 'fill', 'fill with chat']
    const button_group_style = {
        marginLeft: 40,
        display: 'inline-block',
        maxWidth: 300,
    }

    let mini_position_style
    if (mini_position === 'right') {
        mini_position_style = {
            top: getHeight({ width: youtube_width_actual }) - mini_twitch_bottom_pos,
            right: 0,
        }
    } else if (mini_position === 'left') {
        mini_position_style = {
            top: getHeight({ width: youtube_width_actual }) - mini_twitch_bottom_pos,
            left: 0,
        }
    } else if (mini_position === 'center') {
        mini_position_style = {
            top: getHeight({ width: youtube_width_actual }) - mini_twitch_bottom_pos,
            left: youtube_width_actual / 2 - mini_twitch_width / 2,
        }
    }

    const twitch_chat_height = getHeight({ width: youtube_width_actual })

    return (
        <div>
            {caster_data && (
                <>
                    <h1 style={{ textAlign: 'center', marginBottom: 5 }}>
                        {caster_data.twitch_channel}
                    </h1>

                    {/* <div style={{ textAlign: 'center' }}> */}
                    {/*     <Link to="/">go home</Link> */}
                    {/* </div> */}

                    <div style={{ textAlign: 'center' }}>
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
                            <h4>{caster_data.twitch_channel} chat</h4>
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
                                {show_twitch_in_youtube === true && (
                                    <>
                                        <h5>Mini Player Position</h5>
                                        <div style={{ display: 'inline-block' }}>
                                            {['left', 'center', 'right'].map((pos, key) => {
                                                return (
                                                    <button
                                                        key={`${pos}-${key}`}
                                                        style={getButtonStyle(
                                                            mini_position === pos,
                                                        )}
                                                        onClick={() => setMiniPosition(pos)}
                                                    >
                                                        {pos}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </>
                                )}
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
                                                        {typeof pixel_width === 'string'
                                                            ? ''
                                                            : 'px'}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div style={{ height: 20 }}></div>
                    <div style={{ display: 'flex', margin: 'auto', flexWrap: 'wrap' }}>
                        {show_chat !== '' && (
                            <div style={{ marginRight: 'auto' }}>
                                <TwitchChatEmbed
                                    height={twitch_chat_height}
                                    width={chat_width}
                                    config={caster_data}
                                    channel={show_chat}
                                />
                            </div>
                        )}

                        <div style={{ margin: 'auto' }}>
                            {!show_twitch_in_youtube && (
                                <div>
                                    <TwitchEmbed width={twitch_width_actual} config={caster_data} />
                                </div>
                            )}

                            <div>
                                <div style={{ position: 'relative' }}>
                                    <YoutubeEmbed
                                        caster={caster}
                                        width={youtube_width_actual}
                                        youtube_live_url={caster_data.youtube_url}
                                        my_caster={my_caster}
                                        csrf={csrf}
                                    />

                                    {show_twitch_in_youtube && (
                                        <div
                                            style={{
                                                ...mini_position_style,
                                                position: 'absolute',
                                                zIndex: 10,
                                                borderRadius: '5%',
                                            }}
                                        >
                                            <TwitchEmbed
                                                width={mini_twitch_width}
                                                config={caster_data}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <br />
                            <div style={{ display: 'inline-block', width: youtube_width_actual }}>
                                <div style={{ padding: 15 }}>
                                    <Instructions />
                                </div>
                            </div>
                        </div>

                        {caster_chat && (
                            <div style={{ marginLeft: 'auto' }}>
                                <TwitchChatEmbed
                                    height={twitch_chat_height}
                                    width={chat_width}
                                    config={caster_data}
                                />
                            </div>
                        )}
                    </div>

                    <div style={{ height: 200 }}></div>
                </>
            )}
        </div>
    )
}
