import { createSelector } from 'reselect'
import _ from 'lodash'

const _getGroupMessages = (state, props) => {

  let messages = []
  const group = props.group
  if (group) {
    messages = state.message.filter((m) => m.group_id === group.id)
  }

  return _.sortBy(messages, 'created')

}

export const getGroupMessages = createSelector(
  [_getGroupMessages],
  (count) => count,
)

const _getMessageUser = (state, props) => {
  const user = state.user
  const message = props.message
  if (!message) {
    return null
  }

  return user.find((u) => u.id === message.user_id)
}
export const getMessageUser = createSelector(
  [_getMessageUser],
  (count) => count,
)
