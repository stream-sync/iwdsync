import React from 'react'
import { getTwitchEmbedUrl } from './twitchembed'

export function TwitchChatEmbed(props) {
    const config = props.config
    return (
        <div>
            {config && config.twitch_channel &&
            <iframe
                title='twitch-chat-embed'
                frameBorder="0px"
                scrolling='yes'
                id={config.twitch_channel}
                src={getTwitchEmbedUrl(config, true)}
                height={700}
                width={350}
            ></iframe>
            }
        </div>
    )
}
