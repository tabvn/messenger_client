import { PUSH_FRIEND, SET_FRIEND } from '../types'

export default (state = [], action) => {
  switch (action.type) {

    case SET_FRIEND:

      let newState = [...state]

      const payload = action.payload

      if (payload.length) {
        payload.forEach((v) => {
          const index = v.index
          newState[index] = v.friend
        })
      }

      return newState

    case PUSH_FRIEND:

      if (action.payload.length) {
        state = state.concat(action.payload)
      }

      return state

    default:

      return state
  }
}