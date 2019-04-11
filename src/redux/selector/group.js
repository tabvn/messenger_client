import {createSelector} from 'reselect'
import _ from 'lodash'

const _getGroupUsers = (state, props) => {

  const currentUser = state.app.user

  let group = props.group
  if (group && group.id) {
    const findGroup = state.group.find((g) => g.id === group.id)
    if (findGroup) {
      group = findGroup
    }

  }
  let users = _.get(group, 'users', [])

  users = users.filter((u) => u.id !== currentUser.id)

  if (users.length) {
    users.forEach((u, i) => {
      const user = state.user.find((i) => i.id === u.id)
      if (user) {
        users[i] = user
      }
    })
  }

  return users

}
export const getGroupUsers = createSelector(
    [_getGroupUsers],
    (items) => items,
)

const _getLastMessage = (state, props) => {
  const group = props.group

  const messages = state.message.filter((m) => m.group_id === group.id)

  if (!messages.length) {

    return null
  }

  return _.maxBy(messages, 'created')

}

export const getLastMessage = createSelector(
    [_getLastMessage],
    (items) => items,
)

const _getGroups = (state, props) => {

  const sidebarSearch = state.sidebar.search
  const activeTabIndex = state.sidebar.activeTabIndex

  if (sidebarSearch !== '' && activeTabIndex === 0) {
    return state.search.groups
  }
  return state.group.filter((g => _.get(g, 'archive', false) === false))

}
export const getGroups = createSelector(
    [_getGroups],
    (items) => items,
)

const _getUnreadCount = (state) => {

  const groups = state.group

  let unread = 0
  if (groups.length === 0) {
    return unread
  }

  groups.forEach((g) => {
    unread = unread + g.unread
  })

  return unread

}

export const getUnreadCount = createSelector(
    [_getUnreadCount],
    (count) => count,
)

const _getGroupUnreadCount = (state, groupId) => {

  if (!groupId) {
    return 0
  }
  const groups = state.group

  const group = groups.find((g) => g.id === groupId)

  return _.get(group, 'unread', 0)

}

export const getGroupUnreadCount = createSelector(
    [_getGroupUnreadCount],
    (count) => count,
)

const _groupIsActive = (state, groupId, dock = false) => {

  if (!groupId) {
    return false
  }

  if (dock) {
    return _.get(state.chat.active, 'group.id') === groupId
  }

  return _.get(state.inbox.active, 'group.id') === groupId

}

export const groupIsActive = createSelector(
    [_groupIsActive],
    (r) => r,
)

