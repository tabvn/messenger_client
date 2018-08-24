import { createSelector } from 'reselect'
import _ from 'lodash'

const _getFriends = (state, props) => {

  const users = state.user

  const sidebarSearch = state.sidebar.search
  const activeTabIndex = state.sidebar.activeTabIndex

  if (sidebarSearch !== '' && activeTabIndex === 1) {
    return state.search.friends
  }

  let friends = state.friend

  if (!friends.length) {
    return []
  }

  return friends.map((friend) => {
    const user = users.find((u) => u.id === friend.id)

    if (user) {
      const status = _.get(user, 'status', null)
      if (status) {

        friend.status = status
      }
    }

    return friend

  })

}
export const getFriends = createSelector(
  [_getFriends],
  (items) => items,
)