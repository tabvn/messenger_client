import { api } from '../../config'
import { LOAD_EMOJI, SELECT_EMOJI } from '../types'
import { setError } from './error'

export const getEmojis = () => {
  return (dispatch, getState, {service}) => {
    const emoji = getState().emoji
    if (emoji.length) {
      return
    }

    service.get(`${api}/public/emoji.json`).then((res) => {
      dispatch({
        type: LOAD_EMOJI,
        payload: res.data
      })
    }).catch((err) => {
      dispatch(setError(err))
    })

  }
}

export const selectEmoji = (emoji) => {
  return (dispatch) => {
    dispatch({
      type: SELECT_EMOJI,
      payload: emoji
    })
  }
}