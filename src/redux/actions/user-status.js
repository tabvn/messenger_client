import { UPDATE_USER_STATUS } from '../types'
import { setError } from './error'

export const updateUserStatus = (status, callService = false) => {
  return (dispatch, getState, {service}) => {

    dispatch({
      type: UPDATE_USER_STATUS,
      payload: status
    })

    if (callService) {

      const q = `mutation updateUserStatus {
        updateUserStatus(status: "${status}")
      }`

      service.request(q).catch((e) => {
        dispatch(setError(e))
      })
    }
  }
}