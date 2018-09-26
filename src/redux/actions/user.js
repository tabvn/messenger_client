import { PUSH_USER, SET_CURRENT_USER, SET_USER } from '../types'
import { setError } from './error'

/**
 * Set or push user to redux
 * @param user
 * @returns {Function}
 */
export const setUser = (user) => {

  return (dispatch, getState) => {

    const users = getState().user

    let existItems = []
    let newItems = []

    let items = Array.isArray(user) ? user : [user]

    if (!items.length) {
      return
    }

    if (users.length) {
      items.forEach((v) => {
        const index = users.findIndex((i) => i.id === v.id)
        if (index !== -1) {
          // exist
          existItems.push({index: index, user: v})
        } else {
          // this is new items
          newItems.push(v)
        }
      })

      // let update exist first
      if (existItems.length) {
        dispatch({
          type: SET_USER,
          payload: existItems
        })
      }

      if (newItems.length) {
        dispatch({
          type: PUSH_USER,
          payload: newItems,
        })
      }
    } else {
      dispatch({
        type: PUSH_USER,
        payload: items
      })
    }

  }
}

/**
 * Set current user to store
 * @param user
 * @returns {Function}
 */
export const setCurrentUser = (user) => {
  return (dispatch) => {

    dispatch({
      type: SET_CURRENT_USER,
      payload: user
    })
  }
}

/**
 *  Search users
 * @param search
 * @param limit
 * @param skip
 * @returns {function(*=, *, {service: *}): Promise<any>}
 */
export const searchUsers = (search = '', limit = 50, skip = 0) => {

  return (dispatch, getState, {service}) => {

    return new Promise((resolve, reject) => {

      const query = `
      query users {
        users(search: "${search}", limit: ${limit}, skip: ${skip}) {
          id
          uid
          friend
          first_name
          last_name
          avatar
          email
          status
          password
          blocked
        }
      }
      `

      service.request(query).then((res) => {

        return resolve(res.users)

      }).catch((e) => {

        dispatch(setError(e))
        return reject(e)
      })
    })
  }
}

export const blockUser = (userId) => {

  return (dispatch, getState, {service}) => {

    const state = getState()

    const user = state.user.find((u) => u.id === userId)

    if (user) {
      user.blocked = true
      dispatch(setUser(user))
    }



    const query = `mutation blockUser {
      blockUser(friend: ${userId})
    }
    `

    service.request(query).then((res) => {

      console.log('Success blocked', res.blockUser)
    })
  }
}