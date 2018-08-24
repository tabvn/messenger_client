import { SET_SEARCH_FRIENDS_RESULTS, SET_SEARCH_GROUPS_RESULTS } from '../types'

export default (state = {
  groups: [],
  friends: [],

}, action) => {

  switch (action.type) {

    case SET_SEARCH_GROUPS_RESULTS:

      return {
        ...state,
        groups: action.payload,
      }

    case SET_SEARCH_FRIENDS_RESULTS:

      return {
        ...state,
        friends: action.payload,
      }
    default:
      return state
  }
}