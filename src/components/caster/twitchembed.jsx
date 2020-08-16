import React, { useEffect, useState, useRef } from 'react'
import Moveable from 'react-moveable'

import { parents } from '../../configs/gen'

export function getTwitchEmbedUrl(channel, chat = false) {
    const parentString = process.env.REACT_APP_TWITCH_PARENTS.split(',')
        .map((parent) => `&parent=${parent}`)
        .join('')

    if (chat) {
        return `https://www.twitch.tv/embed/${channel}/chat?darkpopout${parentString}`
    } else {
        return `https://player.twitch.tv/?channel=${channel}${parentString}`
    }
}

export function TwitchEmbed(props) {
    const [player, setPlayer] = useState(null)
    const [moveableTarget, setMoveableTarget] = useState()
    const [moveableFrame, setMoveableFrame] = useState({
        translate: [0, 0],
    })

    const config = props.config
    const defaultResolution = props.default_resolution || '360p'

    useEffect(() => {
        if (!player || config.twitch_channel !== player._options.channel) {
            let options = {
                channel: config.twitch_channel,
                parent: parents,
                width: '100%',
                height: '100%',
            }
            let player = new window.Twitch.Player('twitch-player-div', options)

            setPlayer(player)
        }
    }, [config.twitch_channel, setPlayer, player])

    useEffect(() => {
        setTimeout(() => {
            if (player) {
                player.setQuality(defaultResolution)
            }
        }, 5000)
    }, [player, defaultResolution])

    useEffect(() => {
        setMoveableTarget(document.querySelector('.twitch-video'))
    }, [])

    return (
        <div className="twitch-video">
            <Moveable
                target={moveableTarget}
                dragArea={true}
                draggable={true}
                zoom={1}
                origin={false}
                throttleDrag={0}
                padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                onDragStart={({ set }) => {
                    set(moveableFrame.translate)
                }}
                onDrag={({ beforeTranslate }) => {
                    moveableFrame.translate = beforeTranslate
                }}
                onRender={({ target }) => {
                    const { translate } = moveableFrame
                    target.style.transform = `translate(${translate[0]}px, ${translate[1]}px)`
                }}
            />
            <div id="twitch-player-div" style={{ height: '100%' }}></div>
        </div>
    )
}
