import React, { useEffect, useState, useRef } from 'react'
import Moveable from 'react-moveable'
import { useStore } from 'react-hookstore'

import { POSITION_TWITCH_EMBED } from '../../actions/ui'
import { twitchParents } from '../../configs/gen'

const translateStyle = (translate) => `translate(${translate[0]}px, ${translate[1]}px)`

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
    const [ui, uiDispatch] = useStore('ui')

    const moveableTarget = useRef()
    const eventSink = useRef()

    const config = props.config
    const defaultResolution = props.default_resolution || '360p'

    useEffect(() => {
        if (!player || config.twitch_channel !== player._options.channel) {
            let options = {
                channel: config.twitch_channel,
                parent: twitchParents,
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
            <div
                id="twitch-player-div"
                style={{
                    height: ui.twitchEmbed.size.height,
                    width: ui.twitchEmbed.size.width,
                    transform: `translate(${ui.twitchEmbed.translate[0]}px, ${ui.twitchEmbed.translate[1]}px)`,
                }}
                ref={moveableTarget}
            ></div>
            <Moveable
                target={moveableTarget.current}
                zoom={1}
                origin={false}
                renderDirections={[]}
                padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                draggable={true}
                dragArea={true}
                throttleDrag={0}
                onDragStart={({ set }) => {
                    set(ui.twitchEmbed.translate)
                }}
                onDrag={({ target, beforeTranslate }) => {
                    target.style.transform = translateStyle(beforeTranslate)
                }}
                onDragEnd={({ lastEvent }) => {
                    if (lastEvent) {
                        uiDispatch({
                            type: POSITION_TWITCH_EMBED,
                            translate: lastEvent.beforeTranslate,
                            size: ui.twitchEmbed.size,
                        })
                    }
                }}
                resizable={true}
                keepRatio={true}
                edge={true}
                onResizeStart={({ setOrigin, dragStart }) => {
                    setOrigin(['%', '%'])
                    eventSink.current.style.visibility = 'visible'
                    dragStart && dragStart.set(ui.twitchEmbed.translate)
                }}
                onResize={({ target, width, height, drag }) => {
                    const { beforeTranslate } = drag

                    target.style.width = `${width}px`
                    target.style.height = `${height}px`
                    target.style.transform = translateStyle(beforeTranslate)
                }}
                onResizeEnd={({ lastEvent }) => {
                    console.log(lastEvent)
                    if (lastEvent) {
                        uiDispatch({
                            type: POSITION_TWITCH_EMBED,
                            translate: lastEvent.drag.beforeTranslate,
                            size: { height: lastEvent.height, width: lastEvent.width },
                        })
                        eventSink.current.style.visibility = 'hidden'
                    }
                }}
            />
            <div className="moveable-event-sink" ref={eventSink}></div>
        </div>
    )
}
