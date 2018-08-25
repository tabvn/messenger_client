import { PUSH_MESSAGE, REMOVE_MESSAGE, SET_MESSAGE, UPDATE_MESSAGE } from '../types'

export default (state = [], action) => {
  switch (action.type) {

    case REMOVE_MESSAGE:

      let newStateOfMessage = [...state]

      const deleteIndex = state.find((m) => m.id === action.payload)
      if (deleteIndex !== -1) {
        newStateOfMessage = newStateOfMessage.slice()
        newStateOfMessage.splice(deleteIndex, 1)
      }

      return newStateOfMessage

    case SET_MESSAGE:

      const payload = action.payload

      let newState = [...state]

      if (payload.length) {
        payload.forEach((v) => {
          const index = v.index
          newState[index] = v.message
        })
      }

      return newState

    case PUSH_MESSAGE:

      let s = [...state]

      action.payload.forEach((m) => {
        s.push(m)
      })

      return s

    case UPDATE_MESSAGE:

      let isDel = -1

      let ss = state.map((m, index) => {

        if (m.id === action.payload.id) {

          if (action.payload.message === null) {
            isDel = index
          }

          return {
            ...m,
            ...action.payload.message
          }

        }

        return m

      })

      if (isDel !== -1) {
        ss = ss.slice()
        ss.splice(isDel, 1)
      }

      return ss

    default:
      return state
  }
}