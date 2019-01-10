import { ENDTYPING, ONTYPING } from '../types'
import { setError } from './error'


export const userIsTyping = (userId, groupId, sync = false) => {
  return (dispatch, getState, {service}) => {

    dispatch({
      type: ONTYPING,
      payload: {
        userId: userId,
        groupId: groupId
      }
    })

    if(sync){
      const query = `mutation userTyping {
        userTyping(user_id: ${userId}, group_id: ${groupId}, is_typing: true)
      }
    `
      service.request(query).catch((e) => {
        dispatch(setError(e))
      })

    }

  }
}


export const userIsEndTyping = (userId, groupId, sync = false) => {

  return (dispatch, getState, {service}) => {
    dispatch({
      type: ENDTYPING,
      payload: {
        userId: userId,
        groupId: groupId
      }
    })


    if(sync){
      const query = `mutation userTyping {
        userTyping(user_id: ${userId}, group_id: ${groupId}, is_typing: false)
      }
    `
      service.request(query).catch((e) => {
        dispatch(setError(e))
      })

    }
  }
}