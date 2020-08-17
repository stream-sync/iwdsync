import React, { useState, useEffect, useCallback } from 'react'
import { useLocalStorage } from '../../helper/hooks'
import api from '../../api/api'

export function YoutubeEmbed(props) {
    const [player, setPlayer] = useState(null)
    const [youtubeUrl, setYoutubeUrl] = useState('')
    const [timingData, setTimingData] = useState({})
    const [offset, setOffset] = useLocalStorage('timing_offset', -9)
    const [lastTimingUpdate, setLastTimingUpdate] = useLocalStorage('last_timing_update', null)
    const { caster, myCaster, youtubeLiveUrl, csrf } = props
    const youtubeId = youtubeLiveUrl ? youtubeLiveUrl.split('?v=')[1] : undefined

    const updateYoutubeUrl = () => {
        api.caster.update({ youtube_url: youtubeUrl }, props.csrf).then(() => {
            window.location.reload()
        })
    }

    const updateSyncTime = useCallback(
        (youtubeTime) => {
            // const youtube_time = player.playerInfo.currentTime
            const d = new Date()
            const irlTime = d.getTime() / 1000
            return api.caster.update(
                {
                    irl_time: irlTime,
                    youtube_time: youtubeTime,
                },
                csrf,
            )
        },
        [csrf],
    )

    const updateSyncIfCaster = useCallback(
        (event) => {
            if (caster === myCaster.url_path) {
                updateSyncTime(event.target.playerInfo.currentTime)
            }
        },
        [caster, myCaster.url_path, updateSyncTime],
    )

    const createPlayer = useCallback(() => {
        if (youtubeId) {
            let new_player = new window.YT.Player('ytplayer', {
                videoId: youtubeId,
                width: '100%',
                height: '100%',
                events: {
                    onStateChange: updateSyncIfCaster,
                    onReady: (event) => {
                        event.target.mute()
                        // event.target.playVideo()
                    },
                },
            })
            setPlayer(new_player)
        }
    }, [youtubeId, updateSyncIfCaster])

    const moveToSyncTime = useCallback(
        (casterIrlTime, casterYoutubeTime) => {
            if (player !== null && player.seekTo) {
                const myTime = new Date().getTime() / 1000
                const timeDelta = myTime - casterIrlTime
                const syncedTime = casterYoutubeTime + timeDelta + parseFloat(offset)
                player.seekTo(syncedTime, true)
            }
        },
        [player, offset],
    )

    const syncToCaster = () => {
        const lastUpdate = lastTimingUpdate || 1
        let now = new Date()
        now = now.getTime() / 1000
        const delta = Math.abs(lastUpdate - now)
        if (delta > 5) {
            api.caster.get({ url_path: caster }).then((response) => {
                setTimingData(response.data.data)
                setLastTimingUpdate(now)
            })
        } else {
            let tempTiming = { ...timingData }
            tempTiming.caster_youtube_time += 0.001
            setTimingData(tempTiming)
        }
    }

    // move to sync time on timing_data change
    useEffect(() => {
        const casterIrlTime = timingData.irl_time
        const casterYoutubeTime = timingData.youtube_time
        moveToSyncTime(casterIrlTime, casterYoutubeTime)
    }, [timingData, moveToSyncTime])

    // set player on load
    useEffect(() => {
        window.YT.ready(createPlayer)
    }, [createPlayer])

    return (
        <>
            <div id="ytplayer"></div>
            <div>
                {myCaster.url_path === caster && (
                    <>
                        <div>
                            <input
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        updateYoutubeUrl()
                                    }
                                }}
                                style={{ display: 'inline-block' }}
                                type="text"
                                value={youtubeUrl}
                                onChange={(event) => setYoutubeUrl(event.target.value)}
                            />
                            <button onClick={updateYoutubeUrl} style={{ display: 'inline-block' }}>
                                Set youtube URL
                            </button>
                        </div>
                        {/* <button onClick={() => updateSyncTime(player.playerInfo.currentTime)}> */}
                        {/*     Set Sync Time for Viewers */}
                        {/* </button> */}
                    </>
                )}
                {myCaster.url_path !== caster && (
                    <>
                        <div style={{ display: 'inline-block', marginRight: 8 }}>offset</div>
                        <input
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    syncToCaster()
                                }
                            }}
                            style={{ width: 100 }}
                            type="number"
                            step="0.1"
                            value={offset}
                            onChange={(event) => setOffset(event.target.value)}
                        />
                        <button onClick={syncToCaster}>sync to caster</button>
                    </>
                )}
            </div>
        </>
    )
}
