import React from 'react'
import { getTwitchEmbedUrl } from './twitchembed'

export function TwitchChatEmbed(props) {
    const config = props.config
    const channel = props.channel || config.twitch_channel
    return (
        <div>
            <h4>{channel}</h4>
            {config && config.twitch_channel && (
                <iframe
                    title="twitch-chat-embed"
                    frameBorder="0px"
                    scrolling="yes"
                    id={config.twitch_channel}
                    src={getTwitchEmbedUrl(channel, true)}
                    height={700}
                    width={350}
                ></iframe>
            )}
        </div>
    )
}
