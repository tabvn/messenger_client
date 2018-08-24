import _ from 'lodash'
import { REMOVE_INBOX_ACTIVE, SET_INBOX_ACTIVE } from '../types'
import { removeUnreadCount, setGroup } from './group'

export const openInboxChat = (users = [], group = {id: null, title: '', avatar: ''}, isNew = false) => {
  return (dispatch, getState) => {

    const state = getState()
    const currentUserId = _.get(state.app.user, 'id', null)

    const groupId = _.get(group, 'id', null)

    let userIds = []

    users = users.filter((u) => u.id !== currentUserId)

    users.forEach((u) => {
      userIds.push(u.id)

    })
    userIds = userIds.sort()

    let chat = {
      isNew: isNew,
      group_id: groupId,
      group: {
        users: users,
        id: groupId,
        title: _.get(group, 'title', ''),
        avatar: _.get(group, 'avatar', '')
      }
    }

    let gr = null

    if (groupId) {
      gr = state.group.find((g) => g.id === groupId)

      if (!gr) {
        dispatch(setGroup(group))
      }
    } else {

      if (users.length) {

        gr = state.group.find((g) => {

          let gUsers = g.users

          gUsers = gUsers.filter((i) => i.id !== currentUserId)

          if (gUsers.length === userIds.length) {

            let u = []

            gUsers.forEach((i) => {
              u.push(i.id)
            })

            return _.isEqual(u.sort(), userIds)
          }

          return false
        })
      }

    }

    if (gr) {
      chat.group_id = gr.id
      chat.group.id = gr.id
    }

    dispatch({
      type: SET_INBOX_ACTIVE,
      payload: chat,
    })

    dispatch(removeUnreadCount(groupId))

  }
}

export const removeInboxActive = () => {
  return (dispatch) => {

    dispatch({
      type: REMOVE_INBOX_ACTIVE,
      payload: null
    })
  }
}