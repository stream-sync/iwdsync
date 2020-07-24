import React from 'react'
import YouTube from 'react-youtube'

export function YoutubeEmbed(props) {
    let config = props.config
    if (config.youtube_live_url) {
        let id = config.youtube_live_url.split('?v=')[1]
        config.youtube_id = id
        config.youtube_live_url =
            config.youtube_live_url.replace('/watch?v=', '/embed/') + '?autoplay=1'
    }

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    }
    return (
        <div>
            {config.youtube_id && (
                <YouTube
                    videoId={config.youtube_id} // defaults -> null
                    id="youtube-embed" // defaults -> null
                    opts={opts}
                />
            )}
        </div>
    )
}
