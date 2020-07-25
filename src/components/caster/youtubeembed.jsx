import React from 'react'

export function YoutubeEmbed(props) {
    let youtube_live_url = props.youtube_live_url
    const width = props.width || 640
    if (youtube_live_url) {
        // let id = youtube_live_url.split('?v=')[1]
        youtube_live_url =
            youtube_live_url.replace('/watch?v=', '/embed/') + '?autoplay=1'
    }

    return (
        <div>
            {youtube_live_url && (
                <YoutubeIframe width={width} url={youtube_live_url} />
            )}
        </div>
    )
}

function YoutubeIframe(props) {
    return (
        <div
            style={{maxWidth: props.width, width: props.width}}
            className="video-wrap">
            <div className="video-container">
                <iframe
                    title="youtube-embed"
                    src={props.url}
                    frameBorder="0"
                    autoplay='on'
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    )
}
