import { PUSH_USER, SET_USER } from '../types'

export default (state = [], action) => {
  switch (action.type) {

    case SET_USER:

      const payload = action.payload

      let newState = [...state]
      if (payload.length) {
        payload.forEach((v) => {
          const index = v.index
          newState[index] = v.user
        })
      }

      return newState

    case PUSH_USER:

      let s = [...state]

      if (action.payload.length) {

        action.payload.forEach((u) => {
          s.push(u)

        })
      }

      return s

    default:

      return state
  }
}