import React, { useEffect, useState, useCallback } from 'react'
import { parents } from '../../configs/gen'

export function getTwitchEmbedUrl(channel, chat = false) {
    // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    //     // dev code
    //     parents = ['localhost']
    // }
    const parent_string = parents.map(parent => `&parent=${parent}`).join('')
    if (chat) {
        return `https://www.twitch.tv/embed/${channel}/chat?darkpopout${parent_string}`
    } else {
        return `https://player.twitch.tv/?channel=${channel}${parent_string}`
    }
}

export function TwitchEmbed(props) {
    const [player, setPlayer] = useState(null)
    const config = props.config
    const width = props.width || 640
    const default_resolution = props.default_resolution || "360p"

    const createPlayer = useCallback(() => {
        if (config.twitch_channel) {
            let options = {
                channel: config.twitch_channel,
                parent: parents,
            }
            let player = new window.Twitch.Player('twitch-player-div', options)

            setPlayer(player)
        }
        return player
    }, [config.twitch_channel, player])

    useEffect(() => {
        createPlayer()
    }, [createPlayer])

    useEffect(() => {
        setTimeout(() => {
            if (player) {
                player.setQuality(default_resolution)
            }
        }, 5000)
    }, [player, default_resolution])

    return (
        <div>
            {config && config.twitch_channel && (
                <div style={{ maxWidth: width, width }} className="video-wrap">
                    <div id="twitch-player-div" className="video-container">
                    </div>
                </div>
            )}
        </div>
    )
}
