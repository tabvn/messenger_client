import {PUSH_GROUP, REMOVE_GROUP, SET_GROUP, UPDATE_GROUP} from '../types'

export default (state = [], action) => {

  switch (action.type) {

    case UPDATE_GROUP:

      let nState = [...state]

      nState = nState.map((g) => {

        if (g.id === action.payload.id) {

          return {
            ...g,
            ...action.payload.group,
          }
        }

        return g

      })

      return nState

    case SET_GROUP:

      const payload = action.payload

      let newState = [...state]

      if (payload.length) {
        payload.forEach((v) => {
          const index = v.index
          const group = v.group
          newState[index] = group
        })
      }

      return newState

    case PUSH_GROUP:

      let s = [...state]

      if (action.payload.length) {
        s = s.concat(action.payload)
      }

      return s

    case REMOVE_GROUP:

      let ss = [...state]

      const index = ss.findIndex((u) => u.id === action.payload)
      if (index !== -1) {
        ss = ss.slice()
        ss.splice(index, 1)
      }

      return ss

    default:
      return state
  }
}