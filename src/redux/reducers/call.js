import { CALL_END, START_VIDEO_CALL } from '../types'

const initState = {
  caller: null,
  users: [],
  group: null,
  accept: false
}

export default (state = initState, action) => {

  switch (action.type) {

    case START_VIDEO_CALL:

      return {
        ...state,
        caller: action.payload.caller,
        users: action.payload.users,
        group: action.payload.group

      }

    case CALL_END:

      return {
        ...state,
        caller: null,
        from: null,
        users: [],
        group: null
      }
    default:

      return state
  }
}