import React from 'react'

export function getTwitchEmbedUrl(channel, chat = false) {
    let parent = 'iwdsync.vercel.app'
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        // dev code
        parent = 'localhost'
    }
    if (chat) {
        return `https://www.twitch.tv/embed/${channel}/chat?darkpopout&parent=${parent}`
    } else {
        return `https://player.twitch.tv/?channel=${channel}&parent=${parent}`
    }
}

export function TwitchEmbed(props) {
    const config = props.config
    return (
        <div>
            {config && config.twitch_channel && (
                <iframe
                    title="twitch-embed"
                    src={getTwitchEmbedUrl(config.twitch_channel)}
                    height={390}
                    width={640}
                    frameBorder=""
                    scrolling=""
                    allowFullScreen={true}
                ></iframe>
            )}
        </div>
    )
}
