import _ from 'lodash'

import { ANSWER_CALL, CALL_END, CALL_JOINED, RECEIVE_CALLING, REJECT_CALL, START_VIDEO_CALL } from '../types'

const initState = {
  caller: null,
  users: [],
  group: null,
  accepted: false,
  joined: [],
}

export default (state = initState, action) => {

  switch (action.type) {

    case START_VIDEO_CALL:

      return {
        ...state,
        caller: action.payload.caller,
        users: action.payload.users,
        group: action.payload.group,
        accepted: action.payload.accepted

      }

    case CALL_JOINED:

      let j = state.joined

      j.push(action.payload)
      j = _.uniqBy(j, 'id')

      return {
        ...state,
        joined: j
      }

    case RECEIVE_CALLING:

      return {
        ...state,
        caller: action.payload.caller,
        users: action.payload.users,
        group: action.payload.group,
        accepted: false
      }

    case CALL_END:

      return {
        ...state,
        caller: null,
        users: [],
        group: null,
        accepted: false
      }

    case REJECT_CALL:

      return {

        ...state,
        caller: null,
        users: [],
        group: null,
        accepted: false

      }

    case ANSWER_CALL:

      return {
        ...state,
        accepted: true
      }

    default:

      return state
  }
}