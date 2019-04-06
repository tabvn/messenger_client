import {ADD_GROUP_NOTIFICATION} from '../types'

export default (state = [], action) => {

  switch (action.type) {

    case ADD_GROUP_NOTIFICATION:

      return [...state, action.payload]

    default:
      return state
  }
}