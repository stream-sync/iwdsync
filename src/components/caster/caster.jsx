import React, { useEffect, useState, useCallback } from 'react'
import { useLocalStorage } from '../../helper/hooks'
// import { caster_data } from '../../configs/gen'
import { TwitchEmbed } from './twitchembed'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'
import { getHeight, getWidth } from '../../helper/video'
import { Instructions } from './instructions'
// import queryString from 'query-string'
//
import api from '../../api/api'

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

    let youtube_height = getHeight({ width: youtube_width_actual })
    if (youtube_height > window_height) {
        youtube_height = window_height
        youtube_width_actual = getWidth({ height: youtube_height })
    }

    let twitch_width_actual = twitch_width
    if (twitch_width === 'fill') {
        twitch_width_actual = window_width - 20
    } else if (twitch_width === 'fill with chat') {
        twitch_width_actual = window_width - chat_width_total - 25
    }

    let mini_twitch_width = parseInt(0.18 * youtube_width_actual)
    let mini_twitch_bottom_pos = parseInt(youtube_height * 0.415)
    if (mini_position === 'center') {
        mini_twitch_bottom_pos = youtube_height / 2
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

    const setDefaultsForSmallScreen = useCallback(
        window_width => {
            if (window_width < 900) {
                if (youtube_width !== 'fill') {
                    setYoutubeWidth('fill')
                    setTwitchStyle('mini')
                }
                if (!hide_settings) {
                    setHideSettings(true)
                    setTwitchStyle('mini')
                }
            }
        },
        [youtube_width, hide_settings, setHideSettings, setYoutubeWidth],
    )

    useEffect(() => {
        setDefaultsForSmallScreen(window.innerWidth)
    }, [setDefaultsForSmallScreen])

    // re-set window-width on window resize
    useEffect(() => {
        const resize_event_handler = window.addEventListener('resize', () => {
            if (window.innerWidth !== window_width) {
                setWindowWidth(window.innerWidth)
                setDefaultsForSmallScreen(window.innerWidth)
            }
            if (window.innerHeight !== window_height) {
                setWindowHeight(window.innerHeight)
            }
        })
        return () => {
            window.removeEventListener('resize', resize_event_handler)
        }
    }, [window_width, window_height, setDefaultsForSmallScreen])

    const selectable_widths = [560, 640, 720, 1280, 1600, 'fill', 'fill with chat']
    const button_group_style = {
        marginLeft: 40,
        display: 'inline-block',
        maxWidth: 300,
    }

    let mini_position_style
    if (mini_position === 'right') {
        mini_position_style = {
            top: youtube_height - mini_twitch_bottom_pos,
            right: 0,
        }
    } else if (mini_position === 'left') {
        mini_position_style = {
            top: youtube_height - mini_twitch_bottom_pos,
            left: 0,
        }
    } else if (mini_position === 'center') {
        mini_position_style = {
            top: youtube_height - mini_twitch_bottom_pos,
            left: youtube_width_actual / 2 - mini_twitch_width / 2,
        }
    }

    let twitch_chat_height_default = youtube_height
    let twitch_chat_height = youtube_height
    if (twitch_style === 'above_chat') {
        twitch_chat_height -= getHeight({width: chat_width})
    }

    return (
        <div>
            {caster_data && (
                <>
                    {!hide_settings && (
                        <>
                            <h1 style={{ textAlign: 'center', marginBottom: 5 }}>
                                {caster_data.twitch_channel}
                            </h1>

                            {/* <div style={{ textAlign: 'center' }}> */}
                            {/*     <Link to="/">go home</Link> */}
                            {/* </div> */}

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ ...button_group_style }}>
                                    <h4>Alt Chat</h4>
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
                                        <br />
                                        <button
                                            style={getButtonStyle(show_chat === custom_chat)}
                                            onClick={() => setShowChat(custom_chat)}
                                        >
                                            Custom
                                        </button>
                                        <input type="text" value={custom_chat} onChange={event => setCustomChat(event.target.value)} />
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
                                                    style={getButtonStyle(
                                                        pixel_width === youtube_width,
                                                    )}
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
                                            style={getButtonStyle(twitch_style === 'separate')}
                                            onClick={() => setTwitchStyle('separate')}
                                        >
                                            Separate
                                        </button>
                                        <button
                                            style={getButtonStyle(twitch_style === 'mini')}
                                            onClick={() => setTwitchStyle('mini')}
                                        >
                                            Mini Player
                                        </button>
                                        <button
                                            title='Thanks Zemy'
                                            style={getButtonStyle(twitch_style === 'above_chat')}
                                            onClick={() => setTwitchStyle('above_chat')}
                                        >
                                            Above Chat
                                        </button>
                                    </div>

                                    <div>
                                        {twitch_style === 'mini' && (
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
                                        {twitch_style === 'separate' && (
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
                                                                onClick={() =>
                                                                    setTwitchWidth(pixel_width)
                                                                }
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
                        </>
                    )}
                    <div style={{ display: 'flex', margin: 'auto', flexWrap: 'wrap' }}>
                        {show_chat !== '' && (
                            <div style={{ marginRight: 'auto' }}>
                                <TwitchChatEmbed
                                    height={twitch_chat_height_default}
                                    width={chat_width}
                                    config={caster_data}
                                    channel={show_chat}
                                />
                            </div>
                        )}

                        <div style={{ margin: 'auto' }}>
                            {twitch_style === 'separate' && (
                                <div>
                                    <TwitchEmbed
                                        default_resolution="1080p"
                                        width={twitch_width_actual}
                                        config={caster_data}
                                    />
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

                                    {twitch_style === 'mini' && (
                                        <div
                                            style={{
                                                ...mini_position_style,
                                                position: 'absolute',
                                                zIndex: 10,
                                                borderRadius: '5%',
                                            }}
                                        >
                                            <TwitchEmbed
                                                default_resolution="360p"
                                                width={mini_twitch_width}
                                                config={caster_data}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <button
                                        onClick={() => setHideSettings(!hide_settings)}
                                        style={getButtonStyle(hide_settings)}
                                    >
                                        hide settings
                                    </button>
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
                                {twitch_style === 'above_chat' &&
                                    <TwitchEmbed
                                        default_resolution="480p"
                                        width={chat_width}
                                        config={caster_data}
                                    />
                                }
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
