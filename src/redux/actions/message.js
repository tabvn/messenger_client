import {
  CLOSE_ATTACHMENT_MODAL,
  PUSH_MESSAGE, REMOVE_MESSAGE,
  SET_ATTACHMENT_MODAL, SET_INBOX_ACTIVE,
  SET_MESSAGE,
  SET_SELECTED_ATTACHMENT_MODAL,
  UPDATE_CHAT_TAB, UPDATE_MESSAGE
} from '../types'
import { setError } from './error'
import _ from 'lodash'
import { setGroup } from './group'

export const replaceUrls = (body) => {

  let replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim
  let replacedText = body.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>')

  //URLs starting with www. (without // before it, or it'd re-link the ones done above)
  const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim
  replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>')

  //Change email addresses to mailto:: links
  const replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim
  replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>')

  return replacedText

}

/**
 * Set messages to redux store
 * @param message
 * @returns {Function}
 */
export const setMessage = (message) => {

  return (dispatch, getState) => {

    const messages = getState().message

    let existItems = []
    let newItems = []

    let items = Array.isArray(message) ? message : [message]

    if (!items.length) {
      return
    }

    if (messages.length) {
      items.forEach((v) => {
        if (!v.attachments) {
          v.attachments = []
        }
        const index = messages.findIndex((i) => i.id === v.id)
        if (index !== -1) {
          // exist
          existItems.push({index: index, message: v})
        } else {
          // this is new items
          newItems.push(v)
        }
      })

      // let update exist first
      if (existItems.length) {
        dispatch({
          type: SET_MESSAGE,
          payload: existItems
        })
      }

      if (newItems.length) {
        dispatch({
          type: PUSH_MESSAGE,
          payload: newItems,
        })
      }
    } else {
      dispatch({
        type: PUSH_MESSAGE,
        payload: items
      })
    }

  }
}

export const updateLocalMessage = (id, message = null) => {

  return (dispatch) => {

    dispatch({
      type: UPDATE_MESSAGE,
      payload: {
        id: id,
        message: message,
      }
    })

  }
}

export const loadMessages = (groupId, limit = 50, skip = 0) => {
  return (dispatch, getState, {service}) => {

    const query = `query messages{
        messages(group_id: ${groupId} ,limit: ${limit}, skip: ${skip}){
          id
          body
          emoji
          group_id
          user_id
          unread
          gif
          created
          updated
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
    `

    return service.request(query).then((res) => {

      const messages = res.messages

      dispatch(setMessage(messages))

    }).catch((err) => {

      dispatch(setError(err))
    })

  }
}

export const createConversation = (message, userIds = [], g = {title: '', avatar: ''}) => {

  return (dispatch, getState, {service}) => {

    const state = getState()

    const currentUser = state.app.user
    const currentUserId = _.get(currentUser, 'id', null)
    const tabs = state.chat.tabs

    userIds = userIds.filter((u) => u.id !== currentUserId)

    const participants = JSON.stringify(userIds)
    const body = JSON.stringify(_.get(message, 'body', ''))
    const emoji = _.get(message, 'emoji', false)
    const gif = _.get(message, 'gif', '')
    const attachments = JSON.stringify(_.get(message, 'attachments', []))
    const query = `mutation createConversation {
      createConversation(title: "${_.get(g, 'title', '')}", avatar: "${_.get(g, 'avatar', '')}", participants: ${participants}, body: ${body}, gif: "${gif}", emoji: ${emoji}, attachments: ${attachments}) {
        id
        title
        user_id
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
          created,
          updated
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
    }`

    service.request(query).then((res) => {

      const group = _.get(res, 'createConversation')
      // find and update chat

      const group_id = group.id
      let users = group.users
      users = users.filter((u) => u.id !== currentUserId)

      const messages = group.messages
      dispatch(setMessage(messages))
      dispatch(setGroup(group))

      // find active tab and update info
      let tab = tabs.find((t) => {

        if (t.group.users.length === userIds.length) {

          let u = []

          t.group.users.forEach((i) => {
            u.push(i.id)
          })

          return _.isEqual(u.sort(), userIds.sort())
        }

        return false

      })

      if (tab) {

        tab.group_id = group_id
        tab.group.id = group_id
        tab.group.users = users

        dispatch({
          type: UPDATE_CHAT_TAB,
          payload: tab
        })

      }

      // find inbox and update group id

      const inboxUsers = _.get(state.inbox.active, 'group.users', [])
      if (state.inbox.active && inboxUsers.length) {

        let u = []

        inboxUsers.forEach((i) => {
          u.push(i.id)
        })

        if (_.isEqual(u.sort(), userIds.sort())) {

          // update chat inbox
          let inboxActive = state.inbox.active
          inboxActive.group_id = group_id
          inboxActive.group.id = group_id
          dispatch({
            type: SET_INBOX_ACTIVE,
            payload: inboxActive,
          })
        }

      }

    }).catch((err) => {
      dispatch(setError(err))
    })

  }
}

export const updateMessage = (id, message, callService = false) => {
  return (dispatch, getState, {service}) => {

    message = _.setWith(message, 'updated', Math.floor(Date.now() / 1000))
    dispatch(updateLocalMessage(id, message))

    if (callService) {

      const body = JSON.stringify(message.body)
      const emoji = message.emoji
      const q = `mutation updateMessage{
        updateMessage(id: ${id}, body: ${body}, emoji: ${emoji})
      }`

      service.request(q).catch((e) => {
        dispatch(setError(e))
      })
    }
  }
}

export const sendMessage = (message, group = {id: null, avatar: '', title: ''}, userIds = []) => {
  return async (dispatch, getState, {service}) => {

    const groupId = _.get(group, 'id', null)

    if (groupId === null && !userIds.length) {

      return
    }

    // before send to server let add to local with temp id and status is sending.

    message = _.setWith(message, 'status', 'sending')
    message = _.setWith(message, 'group_id', groupId)
    message = _.setWith(message, 'group', group)
    message = _.setWith(message, 'userIds', userIds)

    let tmpId = _.get(message, 'id', null)
    if (!tmpId) {
      tmpId = generateId()
      message = _.setWith(message, 'id', tmpId)

      dispatch(setMessage(message))

    } else {
      // this is re-send
      dispatch(updateLocalMessage(tmpId, message))
    }

    const files = _.get(message, 'files', [])
    if (files.length) {
      let res = await service.uploadPromise(files)
      const _files = _.get(res, 'data', [])

      if (_files.length) {
        let _attachments = []
        _files.forEach((f) => {
          _attachments.push(f.id)
        })

        message.attachments = _attachments

      }
    }

    if (!groupId) {
      return dispatch(createConversation(message, userIds, group))
    }

    const attachmentIds = JSON.stringify(_.get(message, 'attachments', []))

    const query = `mutation sendMessage {
      sendMessage(group_id: ${groupId}, body: ${JSON.stringify(_.get(message, 'body', ''))}, gif: "${_.get(message, 'gif', '')}", emoji: ${_.get(message, 'emoji', false)}, attachments: ${attachmentIds}) {
        id
        body
        emoji
        gif
        user_id
        group_id
        created
        updated
        attachments {
          id
          message_id
          name
          original
          type
          size
        }
      }
    }`

    service.request(query).then((res) => {

      // we may remove local message
      dispatch(updateLocalMessage(tmpId, null))

      const msg = _.get(res, 'sendMessage')
      dispatch(setMessage(msg))

    }).catch((err) => {

      message.status = 'error'
      dispatch(updateLocalMessage(tmpId, message))

      dispatch(setError(err))
    })

  }
}

const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

export const setAttachmentModal = (group_id = null, attachments = [], selected = null, open = true) => {
  return (dispatch, getState) => {

    dispatch({
      type: SET_ATTACHMENT_MODAL,
      payload: {
        open: open,
        selected: selected,
        attachments: attachments
      }
    })

    if (group_id) {

      let messages = getState().message.filter((m) => m.group_id === group_id)

      messages = _.orderBy(messages, 'created')

      if (messages.length) {
        let ats = []

        messages.forEach((m) => {
          if (m.attachments.length) {
            ats = ats.concat(m.attachments)
          }
        })

        if (ats.length) {

          dispatch({
            type: SET_ATTACHMENT_MODAL,
            payload: {
              open: open,
              attachments: ats,
            }
          })
        }

      }
    }
  }
}

export const closeAttachmentModal = () => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_ATTACHMENT_MODAL,
      payload: false
    })
  }
}

export const setAttachmentModalSelected = (attachment) => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_ATTACHMENT_MODAL,
      payload: attachment
    })
  }
}

export const deleteMessage = (id, callService = false) => {
  return (dispatch, getState, {service}) => {

    dispatch({
      type: REMOVE_MESSAGE,
      payload: id
    })

    if (callService) {

      const query = `mutation deleteMessage{
     
        deleteMessage(id: ${id})
      
      }`

      service.request(query).catch((e) => {

        dispatch(setError(e))
      })
    }

  }
}