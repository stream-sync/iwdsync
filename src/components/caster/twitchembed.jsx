import React from 'react'

export function getTwitchEmbedUrl(config, chat = false) {
    let parent = 'localhost'
    if (chat) {
        return `https://www.twitch.tv/embed/${config.twitch_channel}/chat?parent=${parent}`
    } else {
        return `https://player.twitch.tv/?channel=${config.twitch_channel}&parent=${parent}`
    }
}

export function TwitchEmbed(props) {
    const config = props.config
    return (
        <div>
            {config && config.twitch_channel && (
                <iframe
                    title="twitch-embed"
                    src={getTwitchEmbedUrl(config)}
                    height={300}
                    width={600}
                    frameBorder=""
                    scrolling=""
                    allowFullScreen={true}
                ></iframe>
            )}
        </div>
    )
}
