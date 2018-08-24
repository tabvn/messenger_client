import { REMOVE_INBOX_ACTIVE, SET_INBOX_ACTIVE } from '../types'

const initState = {
  active: null,
}
export default (state = initState, action) => {

  switch (action.type) {

    case SET_INBOX_ACTIVE:

      let s = {...state.active}

      return {
        ...state,
        active: {
          ...s,
          ...action.payload
        },
      }

    case REMOVE_INBOX_ACTIVE:

      return {

        ...state,
        active: null
      }

    default:

      return state
  }
}