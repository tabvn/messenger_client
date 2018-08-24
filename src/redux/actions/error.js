import { SET_ERROR } from '../types'

export const setError = (err) => {

  return (dispatch) => {
    dispatch({
      type: SET_ERROR,
      payload: err
    })
  }
}