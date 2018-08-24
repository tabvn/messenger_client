import _ from 'lodash'
import { setError } from './error'
import { SELECT_GIF, SET_GIF_TRENDING } from '../types'

const url = `https://api.giphy.com/v1`

export const findGif = (search, limit, trending = false, rating = 'G', language = 'en') => {

  return (dispatch, getState) => {

    const state = getState()

    const api = state.app.giphy.api

    const exclude = state.app.giphy.exclude

    _.each(exclude, (word) => {
      if (word && word !== '') {
        search = _.replace(search, new RegExp(word, 'g'), '')
      }
    })

    let path = `/gifs/search?api_key=${api}&q=${search}&limit=${limit}&offset=0&rating=${rating}&lang=${language}`

    if (trending) {
      path = `/gifs/trending?api_key=${api}&limit=${limit}&offset=0`
    }
    const callUrl = `${url}${path}`
    return new Promise((resolve, reject) => {

      if (trending && state.gif.trending.length) {
        return resolve(state.gif.trending)
      }

      return fetch(callUrl).then((res) => res.json()).then(res => {

        if (trending) {
          dispatch({
            type: SET_GIF_TRENDING,
            payload: res.data
          })
        }
        return resolve(res.data)

      }).catch((err) => {
        dispatch(setError(err))
        reject(err)
      })
    })

  }

}

export const selectGif = (gif) => {

  return (dispatch) => {
    dispatch({
      type: SELECT_GIF,
      payload: gif
    })
  }
}