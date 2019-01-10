import { OrderedMap } from 'immutable'
import { ENDTYPING, ONTYPING } from '../types'

export default (state = new OrderedMap(), action) => {

  switch (action.type) {

    case ONTYPING:

      const item = {
        groupId: action.payload.groupId,
        userId: action.payload.userId,
        date: new Date(),
      }

      return state.set(`${item.groupId}_${item.userId}`, item)

    case ENDTYPING:
      return state.remove(`${action.payload.groupId}_${action.payload.userId}`)

    default:
      return state
  }
}