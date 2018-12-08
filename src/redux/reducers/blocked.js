import { REMOVE_BLOCK_USER, SET_BLOCKED_USER } from '../types'
import { OrderedMap } from 'immutable'

const initState = {
  models: new OrderedMap()
}

export default (state = initState, action) => {

  switch (action.type) {

    case SET_BLOCKED_USER:

      return {
        ...state,
        models: state.models.set(action.payload.id, action.payload)
      }

    case REMOVE_BLOCK_USER:

      return {
        ...state,
        models: state.models.remove(parseInt(action.payload))
      }

    default:
      return state
  }
}