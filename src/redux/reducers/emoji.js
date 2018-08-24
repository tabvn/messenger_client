import _ from 'lodash'
import { LOAD_EMOJI, SELECT_EMOJI } from '../types'

export default (state = {
  items: [],
  selected: [],
}, action) => {

  switch (action.type) {

    case LOAD_EMOJI:

      return {
        ...state,

        items: action.payload,
      }

    case SELECT_EMOJI:

      let s = [...state.selected]
      s = [action.payload].concat(s)

      s = _.uniqBy(s, 'emoji')

      return {
        ...state,
        selected: s
      }

    default:

      return state
  }
}