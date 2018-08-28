import _ from 'lodash'
import {
  PUSH_GROUP,
  REMOVE_GROUP,
  SET_GROUP,
  SET_INBOX_ACTIVE,
  SET_SEARCH_GROUPS_RESULTS,
  UPDATE_GROUP
} from '../types'
import { setError } from './error'
import { setUser } from './user'
import { setMessage } from './message'
import { closeChat } from './chat'
import { removeInboxActive } from './inbox'

/**
 * Add group into redux store
 * @param group
 * @returns {Function}
 */
export const setGroup = (group = []) => {

  return (dispatch, getState) => {

    const groups = getState().group

    let existItems = []
    let newItems = []

    let items = Array.isArray(group) ? group : [group]

    if (!items.length) {
      return
    }

    if (groups.length) {
      items.forEach((v) => {
        const index = groups.findIndex((i) => i.id === v.id)
        if (index !== -1) {
          // exist
          existItems.push({index: index, group: v})
        } else {
          // this is new items
          newItems.push(v)
        }
      })

      // let update exist first
      if (existItems.length) {
        dispatch({
          type: SET_GROUP,
          payload: existItems
        })
      }

      if (newItems.length) {
        dispatch({
          type: PUSH_GROUP,
          payload: newItems,
        })
      }
    } else {
      dispatch({
        type: PUSH_GROUP,
        payload: items
      })
    }

  }
}

/**
 * search groups
 * @param search
 * @param limit
 * @param skip
 * @returns {Function}
 */
export const searchGroups = (search, limit = 50, skip = 0) => {

  return (dispatch, getState, {service}) => {

    const query = `
      query groups {
          groups(search: "${search}", limit: ${limit}, skip: ${skip}) {
              id
              title
              avatar
              created
              updated
              unread
              users {
                id
                uid
                first_name
                last_name
                avatar
                status
              }
              messages {
                id
                body
                emoji
                group_id
                user_id
                unread
                gif
                created
                attachments {
                  id
                  message_id
                  name
                  original
                  type
                  size
                }
              }
          }
        }
    `

    return new Promise((resolve, reject) => {

      service.request(query).then((res) => {

        const groups = _.get(res, 'groups', [])

        let users = []
        let messages = []

        if (groups.length) {
          groups.forEach((g) => {
            const gUsers = _.get(g, 'users', [])

            const gMessages = _.get(g, 'messages', [])

            if (gUsers.length) {
              users.concat(gUsers)
            }

            if (gMessages.length) {
              messages.concat(gMessages)
            }
          })

          dispatch(setMessage(messages))

          users = _.uniqBy(users, 'id')
          dispatch(setUser(users))

          if (search === '') {
            dispatch(setGroup(groups))
          }

        }

        dispatch({
          type: SET_SEARCH_GROUPS_RESULTS,
          payload: groups
        })

        return resolve(groups)

      }).catch((err) => {

        dispatch(setError(err))
        return reject(err)
      })

    })

  }
}

export const removeUnreadCount = (groupId) => {

  return (dispatch, getState, {service}) => {
    const group = getState().group.find((g) => g.id === groupId)

    if (group && group.unread > 0) {
      // update unread count to 0
      group.unread = 0
      dispatch(setGroup(group))

      const q = `
        mutation markAsRead {
          markAsRead(group_id: ${groupId}, ids: [])
        }
      `

      service.request(q).then((res) => {
        console.log('mark as read', res)
      }).catch((err) => {
        dispatch(setError(err))
      })

    }
  }
}

export const archiveGroup = (groupId) => {

  return (dispatch, getState, {service}) => {

    const state = getState()
    let group = state.group.find((g) => g.id === groupId)

    // find and close tab conversation if have

    let tab = state.chat.tabs.find((g) => g.group_id === groupId)
    if (tab) {
      dispatch(closeChat(tab.id))
    }

    if (group) {
      group = _.setWith(group, 'archive', true)

      dispatch(setGroup(group))
    }

    // remove active inbox
    if (_.get(state.inbox.active, 'group.id') === groupId) {
      dispatch(removeInboxActive())
    }

    const q = `mutation archiveGroup {
      archiveGroup(group_id: ${groupId})
    }`
    service.request(q).catch((e) => {
      dispatch(setError(e))
    })

  }
}

export const removeGroup = (groupId) => {
  return (dispatch) => {

    dispatch({
      type: REMOVE_GROUP,
      payload: groupId
    })
  }
}

export const leaveGroupChat = (groupId) => {

  return (dispatch, getState, {service}) => {

    const state = getState()

    const group = state.group.find((g) => g.id === groupId)
    if (group) {
      dispatch(removeGroup(groupId))
    }

    // remove inbox active

    if (_.get(state.inbox.active, 'group.id') === groupId) {
      dispatch(removeInboxActive())
    }

    const q = `mutation leftGroup {
      leftGroup(group_id: ${groupId})
    }
    `
    service.request(q).catch((e) => {
      dispatch(setError(e))
    })
  }
}

export const addUserToGroup = (groupId, user, callService = false) => {
  return (dispatch, getState, {service}) => {

    const state = getState()

    const group = state.group.find((g) => g.id === groupId)

    if (groupId && groupId === _.get(state.inbox.active, 'group.id')) {
      // remove user from inbox as well
      let c = state.inbox.active

      c.group.users.push(user)
      c.group.users = _.uniqBy(c.group.users, 'id')

      dispatch({
        type: SET_INBOX_ACTIVE,
        payload: c
      })
    }

    if (group) {
      group.users.push(user)
      group.users = _.uniqBy(group.users, 'id')
      dispatch(updateGroup(groupId, group))

      if (callService) {
        const q = `mutation joinGroup {
            joinGroup(group_id: ${groupId}, user_id: ${user.id})
        }
      `
        service.request(q).catch((e) => {
          dispatch(setError(e))
        })
      }

    }
  }
}

export const removeUserFromGroup = (groupId, user, callService = false) => {
  return (dispatch, getState, {service}) => {

    const state = getState()

    const group = state.group.find((g) => g.id === groupId)
    const currentUserId = _.get(state.app.user, 'id')

    if (group) {
      group.users = group.users.filter((u) => u.id !== user.id)

      const members = group.users.filter((u) => u.id !== currentUserId)

      if (members.length === 0) {
        // remove group , this is error when websocket realtime. so let keep group there
        // dispatch(removeGroup(groupId))

      } else {
        dispatch(updateGroup(groupId, group))
      }

      // find in active chat
      if (groupId && groupId === _.get(state.inbox.active, 'group.id')) {
        // remove user from inbox as well

        let c = state.inbox.active

        c.group.users = c.group.users.filter((u) => u.id !== user.id)

        dispatch({
          type: SET_INBOX_ACTIVE,
          payload: c
        })
      }

      if (callService) {
        const q = `mutation leftGroup {
            leftGroup(group_id: ${groupId}, user_id: ${user.id})
        }
      `
        service.request(q).catch((e) => {
          dispatch(setError(e))
        })
      }

    }

  }
}

export const updateGroup = (id, group) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_GROUP,
      payload: {
        id: id,
        group
      }
    })
  }
}