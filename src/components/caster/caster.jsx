import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { caster_data } from '../../configs/gen'
import { TwitchEmbed } from './twitchembed'
import { TwitchChatEmbed } from './twitchchatembed'
import { YoutubeEmbed } from './youtubeembed'
import { getHeight } from '../../helper/video'
import queryString from 'query-string'

export function Caster(props) {
    const [ext_config, setExtConfig] = useState({})
    const [show_chat, setShowChat] = useState('lcs')
    const [youtube_width, setYoutubeWidth] = useState(1280)
    const [twitch_width, setTwitchWidth] = useState(640)
    const [show_twitch_in_youtube, setShowTwitchInYoutube] = useState(true)
    let caster = props.match.params.caster
    const config = caster_data[caster]

    console.log(youtube_width)

    const mini_twitch_width = parseInt(0.19 * youtube_width)
    const mini_twitch_bottom_pos = parseInt(getHeight({ width: youtube_width }) * 0.225)

    console.log(mini_twitch_width)
    console.log(mini_twitch_bottom_pos)

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

    const selectable_widths = [560, 640, 720, 1280, 1600]
    const button_group_style = {
        marginLeft: 40,
        display: 'inline-block',
    }

    return (
        <div>
            {ext_config && (
                <>
                    <h1 style={{ textAlign: 'center' }}>{ext_config.title}</h1>
                    <br />
                    <div style={{ textAlign: 'center' }}>
                        <Link to="/">go home</Link>
                    </div>

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
                        <h4>Youtube Video Width</h4>
                        <div style={{ display: 'inline-block' }}>
                            {selectable_widths.map(pixel_width => {
                                return (
                                    <button
                                        key={`youtube-${pixel_width}`}
                                        style={getButtonStyle(pixel_width === youtube_width)}
                                        onClick={() => setYoutubeWidth(pixel_width)}
                                    >
                                        {pixel_width}px
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div style={{ ...button_group_style }}>
                        <h4>Twitch Video Style</h4>

                        <div>
                            <h5>Style</h5>
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
                                                    {pixel_width}px
                                                </button>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ height: 100 }}></div>
                    <div style={{ display: 'flex', margin: 'auto', flexWrap: 'wrap' }}>
                        {show_chat !== '' && (
                            <div style={{ margin: 'auto' }}>
                                <TwitchChatEmbed config={ext_config} channel={show_chat} />
                            </div>
                        )}

                        <div style={{ margin: 'auto' }}>
                            <TwitchChatEmbed config={ext_config} />
                        </div>

                        <div style={{ margin: 'auto' }}>
                            {!show_twitch_in_youtube && (
                                <div>
                                    <TwitchEmbed width={twitch_width} config={ext_config} />
                                </div>
                            )}

                            <div style={{ position: 'relative' }}>
                                <YoutubeEmbed
                                    width={youtube_width}
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
                    </div>

                    <div style={{ height: 200 }}></div>
                </>
            )}
        </div>
    )
}
