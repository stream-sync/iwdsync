import React from 'react'
import { getTwitchEmbedUrl } from './twitchembed'

export function TwitchChatEmbed({ channel = "iwilldominate" }) {
    return (
      <iframe
          height="100%"
          width="100%"
          title="twitch-chat-embed"
          frameBorder="0px"
          scrolling="yes"
          id={channel}
          src={getTwitchEmbedUrl(channel, true)}
      ></iframe>
    );
}
