import {setError} from './error'
import {updateUserStatus} from './user-status'
import _ from 'lodash'
import moment from 'moment'
import {deleteMessage, setMessage, updateLocalMessage} from './message'
import {
  addUserToGroup,
  removeUserFromGroup,
  setGroup,
  updateGroup,
} from './group'
import {setUser} from './user'
import {openChat} from './chat'
import {
  EVENT_GROUP_USER_REMOVED,
  ON_PLAY_SOUND,
  PUSH_MESSAGE,
  REMOVE_FRIEND, UPDATE_GROUP,
} from '../types'
import {callEnd, receiveCalling} from './call'
import {userIsTyping, userIsEndTyping} from './typing'
import {setFriend} from './friend'

const handleReceiveUserStatus = (payload) => {
  return (dispatch, getState) => {

    const state = getState()
    const currentUserId = _.get(state.app.user, 'id')

    if (currentUserId === payload.user_id) {
      dispatch(updateUserStatus(payload.status))
    }

    const user = state.user.find((u) => u.id === payload.user_id)

    if (user) {
      user.status = payload.status
      dispatch(setUser(user))
    }

  }
}

const handleReceiveMessage = (message) => {

  return (dispatch, getState, {service}) => {

    // check if group is not exist so fetch it first
    const state = getState()
    const currentUserId = _.get(state.app.user, 'id')
    const groupId = _.get(message, 'group_id', null)
    let group = state.group.find((g) => g.id === groupId)
    if (!group) {

      const q = `query group {
        group(id: ${groupId}){
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
          members {
            user_id
            added_by
            blocked
            accepted
            created
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
      
      }`

      service.request(q).then((res) => {

        const g = res.group
        dispatch(setUser(g.users))
        dispatch(setMessage(g.messages))
        dispatch(setGroup([g]))

        // open chat tab window
        if (currentUserId !== message.user_id) {
          dispatch(openChat(g.users, g, false))

          if (_.get(state.chat.active, 'group_id') !== groupId &&
              _.get(state.inbox.active, 'group.id') !== groupId) {

            // play sound

            dispatch({
              type: ON_PLAY_SOUND,
              payload: true,
            })

          }

        }

      })

    } else {

      if (currentUserId !== _.get(message, 'user_id')) {
        // this is message send by other so we do need check if not active conversation we increase count

        if (_.get(state.chat.active, 'group_id') !== groupId &&
            _.get(state.inbox.active, 'group.id') !== groupId) {
          // let increase it
          group = _.setWith(group, 'unread', (group.unread + 1))

          // play sound

          dispatch({
            type: ON_PLAY_SOUND,
            payload: true,
          })

        } else {
          // @todo should mark message as read. batch and run it in queue solution
        }
      }

      group = _.setWith(group, 'archive', false)
      if (!state.message.find((m) => m.id === message.id)) {
        dispatch(setMessage(message))
      }

      dispatch(updateGroup(groupId, group))
      // open chat tab window
      if (currentUserId !== message.user_id) {
        dispatch(openChat(group.users, group, false))
      }

    }

  }

}

const handleReceiveUserLeftGroup = (payload) => {

  return (dispatch, getState) => {

    const state = getState()
    const group_id = _.get(payload, 'group_id')
    const userId = _.get(payload, 'user_id')

    const user = state.user.find((u) => u.id === userId)

    // remove user in group
    dispatch(removeUserFromGroup(group_id, {id: userId}, false))

    if (user) {

      const currentTimestamp = moment().unix()
      const notifyMessage = {
        group_id: group_id,
        user_id: 0,
        type: 'notification',
        body: `${_.get(user, 'first_name', '')} has left the group`,
        created: currentTimestamp,
        updated: currentTimestamp,
      }

      dispatch({
        type: PUSH_MESSAGE,
        payload: [notifyMessage],
      })

    }

  }
}

const handleReceiveUserJoinGroup = (payload) => {

  return (dispatch, getState) => {

    const state = getState()

    const group_id = _.get(payload, 'group_id')

    const userId = _.get(payload, 'user.id')
    const currentUserId = _.get(state.app.user, 'id', null)

    if (userId === currentUserId) {
      return
    }

    let user = state.user.find((u) => u.id === payload.user.id)
    if (!user) {
      dispatch(setUser([payload.user]))
      user = payload.user
    }

    dispatch(addUserToGroup(group_id, payload.user, false))

    let msg = `${_.get(user, 'first_name')} joined the group`
    const addedByUserId = _.get(payload, 'added_by')
    if (addedByUserId === userId) {

    } else {

      let addedByUser = state.user.find((u) => u.id === addedByUserId)
      if (addedByUser)
        msg = `${_.get(addedByUser, 'first_name')} added ${_.get(user,
            'first_name')} to the group`
    }
    const currentTimestamp = moment().unix()
    const notifyMessage = {
      group_id: group_id,
      user_id: 0,
      type: 'notification',
      body: msg,
      created: currentTimestamp,
      updated: currentTimestamp,
    }

    dispatch({
      type: PUSH_MESSAGE,
      payload: [notifyMessage],
    })

  }
}

const handleReceiveMessageUpdated = (payload) => {

  return (dispatch, getState) => {

    let findMessage = getState().message.find((m) => m.id === payload.id)

    if (findMessage) {

      findMessage = Object.assign(findMessage, payload)
      dispatch(updateLocalMessage(payload.id, findMessage))
    }

  }
}

const handelReceiveAddFriend = (payload) => {
  return (dispatch) => {
    dispatch(setUser(payload.friend))
    dispatch(setFriend([payload.friend]))

  }
}

const handelReceiveUnFriend = (payload) => {
  return (dispatch, getState) => {

    let user = getState().user.find((u) => u.id === payload.friend_id)

    if (user) {
      user = _.setWith(user, 'friend', false)
      dispatch(setUser(user))
      dispatch({
        type: REMOVE_FRIEND,
        payload: payload.friend_id,
      })
    }
  }
}

const handleReceiveCalling = (payload) => {

  return (dispatch) => {

    const p = {
      users: payload.group.users,
      group: payload.group,
      caller: payload.caller,
      accepted: false,
    }

    dispatch(receiveCalling(p))

  }
}

const handleReceiveCallJoin = (payload) => {
  return (dispatch, getState, {service, event}) => {

    const topic = `call_join`
    event.emit(topic, payload.user)
    /* dispatch({
       type: CALL_JOINED,
       payload: payload.user,
     })*/

  }
}

const handleReceiveCallExchange = (payload) => {
  return (dispatch, getState, {service, event}) => {

    const topic = `call_exchange/${payload.from}`
    event.emit(topic, payload)
  }
}

export const handleReceiveRemoveGroupUser = (payload) => {

  return (dispatch, getState, {service, event}) => {

    const state = getState()

    const userId = _.get(payload, 'user_id')
    const currentUserId = _.get(state.app.user, 'id', null)

    const group_id = _.get(payload, 'group_id')

    const user = state.user.find((u) => u.id === userId)

    const currentTimestamp = moment().unix()
    const notifyMessage = {
      group_id: group_id,
      user_id: 0,
      type: 'notification',
      body: `${_.get(payload, 'delete_by.first_name')} removed ${_.get(
          user, 'first_name', '')} from the group`,
      created: currentTimestamp,
      updated: currentTimestamp,

    }

    dispatch({
      type: PUSH_MESSAGE,
      payload: [notifyMessage],
    })

    if (userId === currentUserId) {
      // send notify to removed user

      event.emit(EVENT_GROUP_USER_REMOVED, _.get(payload, 'delete_by'))

    } else {
      // we need remove from the group from redux store
    }

  }
}

export const handleReceiveUserTyping = (payload) => {
  return (dispatch) => {
    if (payload.isTyping) {
      dispatch(userIsTyping(payload.user_id, payload.group_id))
    } else {
      dispatch(userIsEndTyping(payload.user_id, payload.group_id))
    }
  }
}

export const handleGroupUpdated = (payload) => {
  return (dispatch, getState) => {

    const state = getState()

    const id = _.get(payload, 'id')

    let group = state.group.find((g) => g.id === id)

    if (group) {
      group.title = _.get(payload, 'title')
      group.avatar = _.get(payload, 'avatar')

      dispatch({
        type: UPDATE_GROUP,
        payload: {
          id: id,
          group,
        },
      })

      //dispatch(updateGroup(id, group, false))

    }

  }
}

export const handleReceiveWsMessage = (message) => {

  return (dispatch) => {

    try {
      message = JSON.parse(message)

    } catch (e) {

      dispatch(setError(e))
    }

    const action = _.get(message, 'action', '')

    switch (action) {

      case 'user_status':

        dispatch(handleReceiveUserStatus(message.payload))

        break

      case 'left_group':

        dispatch(handleReceiveUserLeftGroup(message.payload))
        break

      case 'join_group':

        dispatch(handleReceiveUserJoinGroup(message.payload))
        break

      case 'message':

        dispatch(handleReceiveMessage(message.payload))

        break

      case 'message_deleted':

        dispatch(deleteMessage(message.payload, false))

        break

      case 'message_updated':

        dispatch(handleReceiveMessageUpdated(message.payload))

        break

      case 'add_friend':

        dispatch(handelReceiveAddFriend(message.payload))

        break

      case 'un_friend':

        dispatch(handelReceiveUnFriend(message.payload))

        break

      case 'calling':

        dispatch(handleReceiveCalling(message.payload))

        break

      case 'call_end':

        dispatch(callEnd(false))

        break

      case 'call_join':

        dispatch(handleReceiveCallJoin(message.payload))

        break

      case 'call_exchange':

        dispatch(handleReceiveCallExchange(message.payload))

        break

      case 'remove_group_user':

        dispatch(handleReceiveRemoveGroupUser(message.payload))

        break

      case 'userTyping':
        dispatch(handleReceiveUserTyping(message.payload))
        break

      case 'groupUpdated':

        dispatch(handleGroupUpdated(message.payload))

        break

      default:

        break
    }

  }
}