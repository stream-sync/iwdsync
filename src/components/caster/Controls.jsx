import React from 'react'
import SVG from 'react-inlinesvg'

export const ChatToggle = ({ state = false, channelTag = '{?!}', mirrorX = false, toggle }) => {
    let classes = 'chat-toggle '
    classes += mirrorX ? 'mirror-x ' : ''
    classes += state === true ? 'active' : ''

    return (
        <SVG
            src="/icons/chat-toggle.svg"
            data-active={state}
            preProcessor={(code) => code.replace('{ch}', channelTag)}
            className={classes}
        />
    )
}

const Controls = () => {
    return (
        <div className="controls">
            <div>
                <ChatToggle channelTag="LCS" />
                <ChatToggle channelTag="LEC" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="live-view-flicker">Live</span>
                <SVG src="/iwd.svg" className="iwd-logo" />
                <span className="live-view-flicker">View</span>
            </div>
            <ChatToggle channelTag="IWD" mirrorX />
        </div>
    )
}

export default Controls
