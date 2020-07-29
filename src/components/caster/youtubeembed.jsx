import React, { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../../helper/hooks'
import api from '../../api/api'

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
                csrf={props.csrf}
            />
        </div>
    )
}

function YoutubeIframe(props) {
    const [player, setPlayer] = useState(null)
    const [youtube_url, setYoutubeUrl] = useState('')
    const [timing_data, setTimingData] = useState({})
    const [offset, setOffset] = useLocalStorage('timing_offset', 8)
    const [last_timing_update, setLastTimingUpdate] = useLocalStorage('last_timing_update', null)
    const caster = props.caster
    const my_caster = props.my_caster
    let youtube_id
    if (props.url) {
        youtube_id = props.url.split('?v=')[1]
    }

    const updateYoutubeUrl = () => {
        api.caster.update({ youtube_url }, props.csrf).then(() => {
            window.location.reload()
        })
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
                events: { onStateChange: updateSyncIfCaster },
            })
            setPlayer(new_player)
        }
    }, [youtube_id, updateSyncIfCaster])

    const moveToSyncTime = useCallback(
        (caster_irl_time, caster_youtube_time) => {
            if (player !== null && player.seekTo) {
                const my_time = new Date().getTime() / 1000
                const time_delta = my_time - caster_irl_time
                const synced_time = caster_youtube_time + time_delta + parseFloat(offset)
                player.seekTo(synced_time, true)
            }
        },
        [player, offset],
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
            <div className="video-container" style={{marginBottom: 4}}>
                <div id="ytplayer"></div>
                {/* <iframe */}
                {/*     title="youtube-embed" */}
                {/*     src={props.url} */}
                {/*     frameBorder="0" */}
                {/*     autoplay='on' */}
                {/*     allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" */}
                {/*     allowFullScreen */}
                {/* ></iframe> */}
            </div>

            {my_caster.url_path === caster && (
                <div>
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
                            Set youtube URL
                        </button>
                    </div>
                    {/* <button onClick={() => updateSyncTime(player.playerInfo.currentTime)}> */}
                    {/*     Set Sync Time for Viewers */}
                    {/* </button> */}
                </div>
            )}
            {my_caster.url_path !== caster && (
                <div>
                    <div style={{ display: 'inline-block', marginRight: 8 }}>delay</div>
                    <input
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                syncToCaster()
                            }
                        }}
                        style={{ width: 100 }}
                        type="number"
                        step="0.1"
                        value={offset}
                        onChange={event => setOffset(event.target.value)}
                    />
                    <button onClick={syncToCaster}>sync to caster</button>
                </div>
            )}
        </div>
    )
}
