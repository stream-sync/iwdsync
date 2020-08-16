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
    const [moveableFrame, setMoveableFrame] = useState({
        translate: [10, 10],
    })

    const moveableTarget = useRef()
    const eventSink = useRef()

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

    return (
        <div className="twitch-video">
            <div id="twitch-player-div" style={{ height: '100%' }} ref={moveableTarget}></div>
            <Moveable
                target={moveableTarget.current}
                zoom={1}
                origin={false}
                renderDirections={[]}
                padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                onRender={({ target }) => {
                    const { translate } = moveableFrame
                    target.style.transform = `translate(${translate[0]}px, ${translate[1]}px)`
                }}
                draggable={true}
                dragArea={true}
                throttleDrag={0}
                onDragStart={({ set }) => {
                    set(moveableFrame.translate)
                }}
                onDrag={({ target, beforeTranslate }) => {
                    moveableFrame.translate = beforeTranslate
                }}
                resizable={true}
                keepRatio={true}
                edge={true}
                onResizeStart={({ setOrigin, dragStart }) => {
                    setOrigin(['%', '%'])
                    eventSink.current.style.visibility = 'visible'
                    dragStart && dragStart.set(moveableFrame.translate)
                }}
                onResize={({ target, width, height, drag }) => {
                    const { beforeTranslate } = drag

                    moveableFrame.translate = beforeTranslate
                    target.style.width = `${width}px`
                    target.style.height = `${height}px`
                }}
                onResizeEnd={() => {
                    eventSink.current.style.visibility = 'hidden'
                }}
            />
            <div className="moveable-event-sink" ref={eventSink}></div>
        </div>
    )
}
