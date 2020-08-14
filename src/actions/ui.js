export const TOGGLE_CHAT = Symbol('TOGGLE_CHAT')

export const symbols = {
    TOGGLE_CHAT,
}

export const actions = {
    [TOGGLE_CHAT]: (state, { channelTag, casterChannelTag, active }) => {
        console.log(state)
        console.log(channelTag, casterChannelTag, active)
        if (channelTag === casterChannelTag) {
            return {
                ...state,
                chats: { ...state.chats, caster: !state.chats.caster },
            }
        }

        return {
            ...state,
            chats: { ...state.chats, side: !active ? channelTag : '' },
        }
    },
}

export default { symbols, actions }
