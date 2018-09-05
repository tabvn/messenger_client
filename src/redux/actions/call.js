import _ from 'lodash'
import { CALL_END, START_VIDEO_CALL } from '../types'
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
          group: group
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

export const callEnd = () => {

  return (dispatch, getState, {service}) => {

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

    dispatch({
      type: CALL_END,
      payload: null
    })
  }
}