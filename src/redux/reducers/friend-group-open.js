import { TOGGLE_FRIEND_GROUP } from '../types'

const initState = {
  online: true,
  offline: true,
  blocked: true
}
export default (state = initState, action) => {

  switch (action.type) {

    case TOGGLE_FRIEND_GROUP:

      const payload = action.payload

      return {
        ...state,
        [payload.key]: payload.open
      }
    default:

      return state
  }
}