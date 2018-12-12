import _ from 'lodash'
import {
  PUSH_FRIEND,
  REMOVE_BLOCK_USER,
  SET_BLOCKED_USER,
  SET_FRIEND,
  SET_SEARCH_FRIENDS_RESULTS,
  TOGGLE_FRIEND_GROUP
} from '../types'
import { setError } from './error'
import axios from 'axios'

export const setFriend = (friend) => {

  return (dispatch, getState) => {

    const friends = getState().friend

    let existItems = []
    let newItems = []

    let items = Array.isArray(friend) ? friend : [friend]

    if (!items.length) {
      return
    }

    if (friends.length) {
      items.forEach((v) => {
        const index = friends.findIndex((i) => i.id === v.id)
        if (index !== -1) {
          // exist
          existItems.push({index: index, friend: v})
        } else {
          // this is new items
          newItems.push(v)
        }
      })

      // let update exist first
      if (existItems.length) {
        dispatch({
          type: SET_FRIEND,
          payload: existItems
        })
      }

      if (newItems.length) {
        dispatch({
          type: PUSH_FRIEND,
          payload: newItems,
        })
      }
    } else {
      dispatch({
        type: PUSH_FRIEND,
        payload: items
      })
    }

  }
}

export const toggleFriendGroup = (key, open = true) => {

  return (dispatch) => {

    dispatch({
      type: TOGGLE_FRIEND_GROUP,
      payload: {
        key: key,
        open: open
      }
    })
  }
}

/**
 * UnBlock Friend
 * @param friend
 * @returns {Function}
 */
export const unblockFriend = (friend) => {

  return (dispatch, getState, {service}) => {

    if (friend.friend) {
      friend.blocked = false
      dispatch(setFriend(friend))
    }

    dispatch({
      type: REMOVE_BLOCK_USER,
      payload: friend.id,
    })

    const query = `mutation unBlockUser {
        unBlockUser(user: 0, friend: ${friend.id})
      }
    `
    return new Promise((resolve, reject) => {
      service.request(query).then((res) => {

        return resolve(res)

      }).catch((err) => {

        /*friend.blocked = true
        dispatch(setFriend(friend))*/

        dispatch({
          type: SET_BLOCKED_USER,
          payload: friend
        })

        dispatch(setError(err))
        return reject(err)
      })

    })

  }
}

export const searchFriends = (search = '', limit = 50, skip = 0) => {

  return (dispatch, getState, {service}) => {

    const q = `query friends {
           friends(search: "${search}", limit: 50, skip: 0) {
            id
            first_name
            last_name
            avatar
            blocked
            status
          }
         }
    `

    return service.request(q).then((res) => {

      const friends = _.get(res, 'friends', [])

      dispatch({
        type: SET_SEARCH_FRIENDS_RESULTS,
        payload: friends
      })

    }).catch(err => {
      dispatch(setError(err))
    })

  }
}

export const addFriend = (user) => {

  return (dispatch, getState, {service}) => {

    dispatch(setFriend(user))

    // request service
    const query = `mutation addFriend {
        addFriend(friend: ${user.id})
      }
    `
    service.request(query).catch((e) => {
      dispatch(setError(e))
    })

  }
}

export const requestAddFriend = (user) => {

  return (dispatch, getState, {service}) => {

    axios.get(`/messenger/request-friend/${user.uid}`).catch((e) => {
      dispatch(setError(e))
    })
    // request service
    const query = `mutation addFriend {
        addFriend(friend: ${user.id})
      }
    `
    service.request(query).catch((e) => {
      dispatch(setError(e))
    })

  }
}

