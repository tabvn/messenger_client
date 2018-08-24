import _ from 'lodash'
import { setGroup } from './group'
import { setMessage } from './message'
import { setCurrentUser, setUser } from './user'
import { setError } from './error'
import { updateUserStatus } from './user-status'
import { setFriend } from './friend'
import { SET_APP_INIT_FETCHED } from '../types'
import { openInboxChat } from './inbox'
import { openChat } from './chat'

/**
 * Init load data for the app
 * @returns {Function}
 */
export const initLoad = () => {

  return (dispatch, getState, {service}) => {

    const query = `
        query init {
          user {
            id
            first_name
            last_name
            email
            avatar
            status
            created
          }
          friends(search: "", limit: 50, skip: 0) {
            id
            first_name
            last_name
            avatar
            blocked
            status
          }
          groups(search: "", limit: 50, skip: 0) {
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

    service.request(query).then((res) => {

      const friends = _.get(res, 'friends', [])

      const groups = _.get(res, 'groups', [])

      let messages = []

      // also save friends to user
      let users = friends && friends.length ? friends : []

      if (groups.length) {
        groups.forEach((g) => {
          const groupMessages = _.get(g, 'messages', [])
          const groupUsers = _.get(g, 'users', [])

          if (groupMessages.length) {
            messages = messages.concat(groupMessages)
          }
          if (groupUsers.length) {
            users = users.concat(groupUsers)
          }

        })
      }

      const me = _.get(res, 'user', null)

      // set current user
      dispatch(setCurrentUser(me))

      // change user status
      dispatch(updateUserStatus(_.get(me, 'status')))

      users = _.uniqBy(users, 'id')

      // save friends to store

      dispatch(setFriend(friends))

      // save user to store
      dispatch(setUser(users))

      // save message to store
      dispatch(setMessage(messages))

      // save groups to store
      dispatch(setGroup(groups))

      dispatch({
        type: SET_APP_INIT_FETCHED,
        payload: true
      })

      const group = _.get(groups, '[0]')
      if (group) {
        dispatch(openInboxChat(group.users, group))
      }

      // re-open group chat windows
      let historyTabs = localStorage.getItem('messenger_chats')
      if (historyTabs) {
        historyTabs = JSON.parse(historyTabs)
        if (historyTabs && historyTabs.length) {
          historyTabs.forEach((gid) => {
            const findGroup = groups.find((g) => g.id === gid)
            if (findGroup) {
              dispatch(openChat(findGroup.users, gid))
            } else {
              historyTabs = historyTabs.filter((i) => i !== gid)
              localStorage.setItem('messenger_chats', JSON.stringify(historyTabs))
            }
          })
        }
      }

    }).catch((err) => {
      console.log('err', err)
      dispatch(setError(err))
    })

  }
}