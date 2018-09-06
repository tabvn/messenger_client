import _ from 'lodash'
import { ANSWER_CALL, CALL_END, RECEIVE_CALLING, REJECT_CALL, START_VIDEO_CALL } from '../types'
import rtc from '../../rtc'

export const startCall = (users = [], group = null) => {

  return (dispatch, getState, {service}) => {

    const currentUser = getState().app.user

    rtc.getUserMedia((err) => {

      if (err) {
        alert(err)
        return
      }

      dispatch({
        type: START_VIDEO_CALL,
        payload: {
          users: users,
          caller: currentUser,
          group: group,
          accepted: true,
        }
      })

      // send signal to server
      let userIds = []
      users.forEach((u) => {
        userIds.push(u.id)
      })

      userIds = _.uniq(userIds)

      const payload = {
        action: 'call',
        payload: {
          group_id: group.id,
          from: currentUser.id,
          to: userIds,
        }
      }

      service.send(payload)

    })

  }
}

export const receiveCalling = (payload) => {
  return (dispatch) => {

    dispatch({
      type: RECEIVE_CALLING,
      payload: payload,
    })
  }
}

export const callEnd = (send = true) => {

  return (dispatch, getState, {service}) => {

    if (send) {
      const call = getState().call

      let userIds = []
      call.users.forEach((u) => {
        userIds.push(u.id)
      })

      service.send({
        action: 'call_end',
        payload: {
          group_id: call.group.id,
          from: call.caller.id,
          to: userIds,
        }

      })
    }

    dispatch({
      type: CALL_END,
      payload: null
    })
  }
}

export const rejectCall = () => {
  return (dispatch, getState, {service}) => {

    const state = getState()
    dispatch({
      type: REJECT_CALL,
      payload: null
    })

    // send to server
    service.send({
      action: 'call_reject',
      payload: {
        group_id: state.call.group.id,
        user_id: state.app.user.id,
      }
    })
  }
}

export const answerCall = () => {
  return (dispatch, getState, {service}) => {

    rtc.getUserMedia((err) => {

      if (err) {
        alert(err)
        return
      }

      const state = getState()
      const user_id = state.app.user.id
      const call = state.call

      dispatch({
        type: ANSWER_CALL,
        payload: null
      })

      let userIds = []
      call.users.forEach((u) => {
        userIds.push(u.id)
      })

      // send service
      service.send({
        action: 'call_join',
        payload: {
          from: call.caller.id,
          group_id: call.group.id,
          user_id: user_id,
          to: userIds,
        }
      })

    })

  }
}