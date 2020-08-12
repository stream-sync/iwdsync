import React from 'react'
import { getTwitchEmbedUrl } from './twitchembed'

export function TwitchChatEmbed(props) {
    const config = props.config
    const channel = props.channel || config.twitch_channel
    return config && config.twitch_channel && (
      <iframe
          height="100%"
          width="100%"
          title="twitch-chat-embed"
          frameBorder="0px"
          scrolling="yes"
          id={config.twitch_channel}
          src={getTwitchEmbedUrl(channel, true)}
      ></iframe>
    ) || null;
}
