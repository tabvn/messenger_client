import _ from 'lodash'
import { SET_BLOCKED_USER } from '../types'

export const setBlockedUser = (user) => {
  return (dispatch) => {

    if (Array.isArray(user)) {
      _.each(user, (u) => {

        dispatch({
          type: SET_BLOCKED_USER,
          payload: u
        })
      })
    } else {

      dispatch({
        type: SET_BLOCKED_USER,
        payload: user,
      })
    }
  }
}