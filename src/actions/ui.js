export const TOGGLE_CHAT = Symbol('TOGGLE_CHAT')
export const POSITION_TWITCH_EMBED = Symbol('POSITION_TWITCH_EMBED')

export const symbols = {
    TOGGLE_CHAT,
    POSITION_TWITCH_EMBED,
}

export const actions = {
    [TOGGLE_CHAT]: (state, { channelTag, casterChannelTag, active }) => {
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
    [POSITION_TWITCH_EMBED]: (state, { translate, size }) => {
        return {
            ...state,
            twitchEmbed: {
                ...state.twitchEmbed,
                translate,
                size,
            },
        }
    },
}

export default { symbols, actions }
