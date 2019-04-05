import _ from 'lodash'
import {
  CLOSE_CHAT_TAB,
  OPEN_CHAT_TAB,
  REMOVE_ACTIVE_CHAT_TAB,
  SET_ACTIVE_CHAT_TAB,
  TOGGLE_CHAT_TAB,
  UPDATE_CHAT_TAB,
} from '../types'
import { removeUnreadCount } from './group'

const ID = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const openChat = (users = [], group = {id: null, title: '', avatar: ''}, setActive = true, isOpen = true) => {
  return (dispatch, getState) => {

    const group_id = _.get(group, 'id', null)
    const state = getState()
    let tab = null
    let userIds = []
    const currentUserId = _.get(state.app.user, 'id', null)

    users = users.filter((u) => u.id !== currentUserId)

    users.forEach((u) => {
      userIds.push(u.id)

    })

    userIds = userIds.sort()

    const tabs = state.chat.tabs

    if (group_id) {

      tab = tabs.find((t) => t.group_id === group_id)


      if (tab) {
        // found
        if (setActive) {
          dispatch(setActiveChat(tab))
        }

        return
      }

    }

    // not group id let find by member
    if (users.length) {
      tab = tabs.find((t) => {
        let u = []

        if (t.group.users.length === userIds.length) {
          t.group.users.forEach((i) => {
            if (i.id !== currentUserId) {
              u.push(i.id)
            }

          })
          return _.isEqual(u.sort(), userIds)
        }

        return false

      })
    }

    if (tab) {

      if (setActive) {
        dispatch(setActiveChat(tab))
      }

      return
    }

    tab = {
      isNew: false,
      id: ID(),
      group_id: group_id,
      open: isOpen,
      group: {
        users: users,
        id: group_id,
        title: _.get(group, 'title', ''),
        avatar: _.get(group, 'avatar', '')
      }
    }

    let gr = null
    if (group_id) {
      gr = state.group.find((g) => g.id === group_id)
    } else {
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

    if (gr) {
      tab.group_id = gr.id
      tab.group.id = gr.id
    }

    // so not need create new chat

    dispatch({
      type: OPEN_CHAT_TAB,
      payload: {
        chat: tab,
        active: setActive
      }
    })

    if (group_id && setActive) {
      dispatch(removeUnreadCount(group_id))
    }

  }
}

export const createChat = () => {

  return (dispatch) => {

    let chat = {
      isNew: true,
      id: ID(),
      group_id: null,
      open: true,
      group: {
        users: [],
        id: null,
        title: '',
        avatar: ''
      }
    }

    dispatch({
      type: OPEN_CHAT_TAB,
      payload: {
        chat: chat,
        active: true
      },

    })

  }
}

export const toggleChat = (id, open = true) => {

  return (dispatch) => {

    dispatch({
      type: TOGGLE_CHAT_TAB,
      payload: {
        id: id,
        open: open
      }
    })
  }
}

export const closeChat = (id) => {
  return (dispatch) => {

    dispatch({
      type: CLOSE_CHAT_TAB,
      payload: id
    })
  }
}

export const removeActiveChat = () => {

  return (dispatch) => {
    dispatch({
      type: REMOVE_ACTIVE_CHAT_TAB,
      payload: null
    })
  }
}

export const setActiveChat = (tab) => {

  return (dispatch) => {

    dispatch({
      type: SET_ACTIVE_CHAT_TAB,
      payload: tab
    })

    const groupId = _.get(tab, 'group.id', null)

    if (groupId) {
      dispatch(removeUnreadCount(groupId))
    }

  }
}

export const addUserToChat = (id, user) => {

  return (dispatch, getState) => {

    const state = getState()
    const chat = state.chat.tabs.find((c) => c.id === id)
    if (chat) {

      chat.group.users.push(user)
      chat.group.users = _.uniqBy(chat.group.users, 'id')

      dispatch({
        type: UPDATE_CHAT_TAB,
        payload: chat
      })
    }

  }
}

export const updateChat = (chat) => {

  return (dispatch) => {
    dispatch({
      type: UPDATE_CHAT_TAB,
      payload: chat
    })
  }
}

export const removeUserFromChat = (id, user) => {

  return (dispatch, getState) => {
    const state = getState()
    const chat = state.chat.tabs.find((c) => c.id === id)
    if (chat) {
      chat.group.users = chat.group.users.filter((u) => u.id !== user.id)

      if (chat.group.users.length === 0) {
        // remove chat
        dispatch(closeChat(chat.id))

      } else {
        dispatch(updateChat(chat))
      }

    }

  }

}

