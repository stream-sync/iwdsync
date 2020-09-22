import React, { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../../helper/hooks'
import api from '../../api/api'
import { useStore } from 'react-hookstore'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

export function YoutubeEmbed(props) {
    let youtube_live_url = props.youtube_live_url
    const width = props.width || 640
    // let youtube_id = null
    // if (youtube_live_url) {
    // youtube_id = youtube_live_url.split('?v=')[1]
    // youtube_live_url = youtube_live_url.replace('/watch?v=', '/embed/') + '?autoplay=1'
    // }

    return (
        <div>
            <YoutubeIframe
                caster={props.caster}
                my_caster={props.my_caster}
                width={width}
                url={youtube_live_url}
                stream_delay={props.stream_delay}
                csrf={props.csrf}
            />
        </div>
    )
}

function YoutubeIframe(props) {
    const [player, setPlayer] = useState(null)
    const [twitchPlayer] = useStore('twitchPlayer')
    const [youtube_url, setYoutubeUrl] = useState('')
    const [stream_delay, setStreamDelay] = useState(0)
    const [timing_data, setTimingData] = useState({})
    const [offset, setOffset] = useLocalStorage('timing_offset', 0)
    const [last_timing_update, setLastTimingUpdate] = useLocalStorage('last_timing_update', null)
    const caster = props.caster
    const my_caster = props.my_caster
    let youtube_id
    if (props.url) {
        youtube_id = props.url.split('?v=')[1]
    }

    // set pre-initialized stream delay value
    useEffect(() => {
        if (my_caster.stream_delay) {
            setStreamDelay(my_caster.stream_delay)
        }
    }, [my_caster])

    const updateYoutubeUrl = () => {
        api.caster.update({ youtube_url }, props.csrf).then(() => {
            window.location.reload()
        })
    }

    const updateStreamDelay = () => {
        api.caster.update({ stream_delay }, props.csrf)
        NotificationManager.success('Successfully set stream delay.', 'Updated');
    }

    const updateSyncTime = useCallback(
        youtube_time => {
            // const youtube_time = player.playerInfo.currentTime
            const d = new Date()
            const irl_time = d.getTime() / 1000
            return api.caster.update({ irl_time, youtube_time }, props.csrf)
        },
        [props.csrf],
    )

    const updateSyncIfCaster = useCallback(
        event => {
            if (caster === my_caster.url_path) {
                updateSyncTime(event.target.playerInfo.currentTime)
            }
        },
        [caster, my_caster.url_path, updateSyncTime],
    )

    const createPlayer = useCallback(() => {
        if (youtube_id) {
            let new_player = new window.YT.Player('ytplayer', {
                videoId: youtube_id,
                events: {
                    onStateChange: updateSyncIfCaster,
                    onReady: event => {
                        event.target.mute()
                        // event.target.playVideo()
                    },
                },
            })
            setPlayer(new_player)
        }
    }, [youtube_id, updateSyncIfCaster])

    const moveToSyncTime = useCallback(
        (caster_irl_time, caster_youtube_time) => {
            if (player !== null && player.seekTo) {
                const player_state = twitchPlayer.getPlayerState()
                const latency = player_state.stats.videoStats.hlsLatencyBroadcaster
                const my_time = new Date().getTime() / 1000
                const time_delta = my_time - caster_irl_time
                const constant_latency_offset = 6.4
                const caster_stream_delay = props.stream_delay || 0
                const full_delay = caster_stream_delay + latency
                const synced_time = caster_youtube_time + time_delta - full_delay - constant_latency_offset
                player.seekTo(synced_time, true)
            }
        },
        [player, offset, twitchPlayer, props.stream_delay],
    )

    const syncToCaster = () => {
        const last_update = last_timing_update || 1
        let now = new Date()
        now = now.getTime() / 1000
        const delta = Math.abs(last_update - now)
        if (delta > 5) {
            api.caster.get({ url_path: caster }).then(response => {
                setTimingData(response.data.data)
                setLastTimingUpdate(now)
            })
        } else {
            let temp_timing = { ...timing_data }
            temp_timing.caster_youtube_time += 0.001
            setTimingData(temp_timing)
        }
    }

    // move to sync time on timing_data change
    useEffect(() => {
        const caster_irl_time = timing_data.irl_time
        const caster_youtube_time = timing_data.youtube_time
        moveToSyncTime(caster_irl_time, caster_youtube_time)
    }, [timing_data, moveToSyncTime])

    // set player on load
    useEffect(() => {
        window.YT.ready(createPlayer)
    }, [createPlayer])

    return (
        <div style={{ maxWidth: props.width, width: props.width }} className="">
            <NotificationContainer/>
            <div className="video-container" style={{ marginBottom: 4 }}>
                <div id="ytplayer"></div>
            </div>

            <div>
                {my_caster.url_path === caster && (
                    <>
                        <div>
                            <input
                                onKeyDown={event => {
                                    if (event.key === 'Enter') {
                                        updateYoutubeUrl()
                                    }
                                }}
                                style={{ display: 'inline-block' }}
                                type="text"
                                value={youtube_url}
                                onChange={event => setYoutubeUrl(event.target.value)}
                            />
                            <button onClick={updateYoutubeUrl} style={{ display: 'inline-block' }}>
                                Set Youtube URL
                            </button>
                            <br />
                            <input
                                onKeyDown={event => {
                                    if (event.key === 'Enter') {
                                        updateStreamDelay()
                                    }
                                }}
                                style={{ display: 'inline-block' }}
                                type="number"
                                step='0.1'
                                value={stream_delay}
                                onChange={event => setStreamDelay(event.target.value)}
                            />
                            <button onClick={updateStreamDelay} style={{ display: 'inline-block' }}>
                                Update Stream Delay
                            </button>
                        </div>
                        {/* <button onClick={() => updateSyncTime(player.playerInfo.currentTime)}> */}
                        {/*     Set Sync Time for Viewers */}
                        {/* </button> */}
                    </>
                )}
                {my_caster.url_path !== caster && (
                    <>
                        {/* <div style={{ display: 'inline-block', marginRight: 8 }}>Stream Delay</div> */}
                        {/* <input */}
                        {/*     onKeyDown={event => { */}
                        {/*         if (event.key === 'Enter') { */}
                        {/*             syncToCaster() */}
                        {/*         } */}
                        {/*     }} */}
                        {/*     style={{ width: 100 }} */}
                        {/*     type="number" */}
                        {/*     step="0.1" */}
                        {/*     value={offset} */}
                        {/*     onChange={event => setOffset(event.target.value)} */}
                        {/* /> */}
                        <button onClick={syncToCaster}>sync to caster</button>
                    </>
                )}
            </div>
        </div>
    )
}
