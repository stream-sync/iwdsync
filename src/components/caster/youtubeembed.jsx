import React, { useState, useEffect, useCallback } from 'react'
import api from '../../api/api'

export function YoutubeEmbed(props) {
    let youtube_live_url = props.youtube_live_url
    const width = props.width || 640
    let youtube_id = null
    if (youtube_live_url) {
        youtube_id = youtube_live_url.split('?v=')[1]
        youtube_live_url = youtube_live_url.replace('/watch?v=', '/embed/') + '?autoplay=1'
    }

    return (
        <div>
            {youtube_live_url && (
                <YoutubeIframe youtube_id={youtube_id} width={width} url={youtube_live_url} />
            )}
        </div>
    )
}

function YoutubeIframe(props) {
    const [player, setPlayer] = useState(null)

    const createPlayer = useCallback(() => {
        let new_player = new window.YT.Player('ytplayer', {
            videoId: props.youtube_id,
        })
        setPlayer(new_player)
    }, [props.youtube_id])

    // set player on load
    useEffect(() => {
        window.YT.ready(createPlayer)
    }, [createPlayer])

    return (
        <div style={{ maxWidth: props.width, width: props.width }} className="">
            <div className="video-container">
                <div id="ytplayer"></div>
                {/* <iframe */}
                {/*     title="youtube-embed" */}
                {/*     src={props.url} */}
                {/*     frameBorder="0" */}
                {/*     autoplay='on' */}
                {/*     allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" */}
                {/*     allowFullScreen */}
                {/* ></iframe> */}
            </div>
        </div>
    )
}
