import { setError } from './error'
import { updateUserStatus } from './user-status'
import _ from 'lodash'
import { setMessage } from './message'
import { addUserToGroup, removeUserFromGroup, setGroup, updateGroup } from './group'
import { setUser } from './user'
import { openChat } from './chat'
import { ON_PLAY_SOUND } from '../types'

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

          if (_.get(state.chat.active, 'group_id') !== groupId && _.get(state.inbox.active, 'group.id') !== groupId) {

            // play sound

            dispatch({
              type: ON_PLAY_SOUND,
              payload: true
            })

          }

        }

      })

    } else {

      if (currentUserId !== _.get(message, 'user_id')) {
        // this is message send by other so we do need check if not active conversation we increase count

        if (_.get(state.chat.active, 'group_id') !== groupId && _.get(state.inbox.active, 'group.id') !== groupId) {
          // let increase it
          group = _.setWith(group, 'unread', (group.unread + 1))

          // play sound

          dispatch({
            type: ON_PLAY_SOUND,
            payload: true
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

  return (dispatch) => {

    const group_id = _.get(payload, 'group_id')
    const userId = _.get(payload, 'user_id')

    // remove user in group
    dispatch(removeUserFromGroup(group_id, {id: userId}, false))

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
    }

    dispatch(addUserToGroup(group_id, payload.user, false))

  }
}
export const handleReceiveWsMessage = (message) => {

  return (dispatch) => {

    try {
      message = JSON.parse(message)

    } catch (e) {
      console.log(e)
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

      default:

        break
    }

  }
}