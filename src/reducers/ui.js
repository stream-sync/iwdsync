import { actions } from '../actions/ui'

export const initialState = {
    chats: {
        side: '',
        caster: true,
    },
}

export const reducer = (state, action) => {
    if (actions[action.type]) {
        return actions[action.type](state, action, initialState)
    }
    return initialState
}
