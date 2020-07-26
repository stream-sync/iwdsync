import React from 'react'
import { getHeight } from '../../helper/video'

export function getTwitchEmbedUrl(channel, chat = false) {
    let parents = [
        'iwdsync.vercel.app',
        'iwdsync-git-master.antigravity.vercel.app',
        'iwdsync.antigravity.vercel.app',
        'localhost',
    ]
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
    const config = props.config
    const width = props.width || 640

    return (
        <div>
            {config && config.twitch_channel && (
                <div style={{ maxWidth: width, width }} className="video-wrap">
                    <div className="video-container">
                        <iframe
                            title="twitch-embed"
                            src={getTwitchEmbedUrl(config.twitch_channel)}
                            height={getHeight({ width })}
                            width={width}
                            frameBorder=""
                            scrolling=""
                            allowFullScreen={true}
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    )
}
