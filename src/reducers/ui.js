import { actions } from '../actions/ui'

export const initialState = {
    chats: {
        side: '',
        caster: true,
    },
    twitchEmbed: {
        translate: [100, 100],
        size: [360, 640],
    },
}

export const reducer = (state, action) => {
    if (actions[action.type]) {
        return actions[action.type](state, action, initialState)
    }
    return initialState
}
