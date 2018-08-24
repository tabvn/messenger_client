import { UPDATE_USER_STATUS } from '../types'

export default (state = 'offline', action) => {

  switch (action.type) {

    case UPDATE_USER_STATUS:

      return action.payload

    default:

      return state
  }
}