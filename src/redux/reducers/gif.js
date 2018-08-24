import { SELECT_GIF, SET_GIF_TRENDING } from '../types'
import _ from 'lodash'

export default (state = {
  trending: [],
  selected: []
}, action) => {

  switch (action.type) {

    case SELECT_GIF:

      let s = [...state.selected]

      s = [action.payload].concat(s)

      s = _.uniqBy(s, 'id')

      return {
        ...state,
        selected: s
      }

    case SET_GIF_TRENDING:

      return {
        ...state,
        trending: action.payload
      }

    default:

      return state
  }
}