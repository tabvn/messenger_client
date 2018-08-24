import { REMOVE_ERROR, SET_ERROR } from '../types'

export default (state = [], action) => {

  switch (action.type) {

    case SET_ERROR:

      return [...state, action.payload]

    case REMOVE_ERROR:

      state = []

      return state

    default:

      return state
  }
}