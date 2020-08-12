import React, { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../../helper/hooks'
import api from '../../api/api'

export function YoutubeEmbed(props) {

    const [player, setPlayer] = useState(null)
    const [youtube_url, setYoutubeUrl] = useState('')
    const [timing_data, setTimingData] = useState({})
    const [offset, setOffset] = useLocalStorage('timing_offset', -9)
    const [last_timing_update, setLastTimingUpdate] = useLocalStorage('last_timing_update', null)
    const caster = props.caster
    const my_caster = props.my_caster

    let youtube_live_url = props.youtube_live_url
    let youtube_id
    if (youtube_live_url) {
        youtube_id = youtube_live_url.split('?v=')[1]
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
                width: '100%',
                height: '100%',
                events: {
                    onStateChange: updateSyncIfCaster,
                    onReady: event => {
                        event.target.mute()
                        event.target.playVideo()
                    },
                },
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
                <div id="ytplayer"></div>
    )
}
