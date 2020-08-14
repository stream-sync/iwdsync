import React from 'react'
import SVG from 'react-inlinesvg'
import { useStore } from 'react-hookstore'

import { TOGGLE_CHAT } from '../../actions/ui'

export const ChatToggle = ({ state = false, channelTag = '{?!}', mirrorX = false, toggle }) => (
    <SVG
        src="/icons/chat-toggle.svg"
        data-active={state}
        data-channel-tag={channelTag}
        preProcessor={(code) => code.replace('{ch}', channelTag)}
        className={`chat-toggle ${mirrorX ? 'mirror-x ' : ''}`}
        onClick={toggle}
    />
)

// TODO: get this from outside
const casterChannelTag = 'IWD'

const Controls = () => {
    const [{ chats }, dispatchUI] = useStore('ui')

    const toggleChat = ({ currentTarget }) => {
        const { channelTag, active } = currentTarget.dataset
        dispatchUI({ type: TOGGLE_CHAT, channelTag, casterChannelTag, active: active === 'true' })
    }

    return (
        <div className="controls">
            <div>
                <ChatToggle channelTag="LCS" state={chats.side === 'LCS'} toggle={toggleChat} />
                <ChatToggle channelTag="LEC" state={chats.side === 'LEC'} toggle={toggleChat} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="live-view-flicker">Live</span>
                <SVG src="/iwd.svg" className="iwd-logo" />
                <span className="live-view-flicker">View</span>
            </div>
            <ChatToggle
                channelTag={casterChannelTag}
                mirrorX
                state={chats.caster}
                toggle={toggleChat}
            />
        </div>
    )
}

export default Controls
