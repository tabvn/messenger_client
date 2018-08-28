import _ from 'lodash'
import { CLOSE_CHAT_TAB, OPEN_CHAT_TAB, SET_ACTIVE_CHAT_TAB, TOGGLE_CHAT_TAB, UPDATE_CHAT_TAB } from '../types'

let saveGroupIds = []

const save = (gid) => {
  saveGroupIds.push(gid)
  saveGroupIds = _.uniq(saveGroupIds)
  localStorage.setItem('messenger_chats', JSON.stringify(saveGroupIds))
}
const remove = (gid) => {
  saveGroupIds = saveGroupIds.filter((id) => id !== gid)
  localStorage.setItem('messenger_chats', JSON.stringify(saveGroupIds))
}

export default (state = {
  tabs: [],
  active: null,
}, action) => {

  switch (action.type) {

    case SET_ACTIVE_CHAT_TAB:

      let tabs = [...state.tabs]

      tabs = tabs.map((t) => {

        if (t.id === action.payload.id) {
          t.open = true
        }

        return t
      })

      return {
        ...state,
        active: action.payload,
        tabs: tabs,
      }

    case OPEN_CHAT_TAB:

      const ggid = _.get(action.payload.chat, 'group_id')
      if (ggid) {
        save(ggid)
      }
      return {
        ...state,
        tabs: [...state.tabs, action.payload.chat],
        active: action.payload.active ? action.payload.chat : state.active,
      }

    case TOGGLE_CHAT_TAB:

      let t = [...state.tabs]

      t = t.map((i) => {

        if (i.id === action.payload.id) {
          i.open = action.payload.open
        }

        return i
      })

      return {
        ...state,
        active: _.get(state, 'active.id') === action.payload.id ? null : state.active,
        tabs: t
      }

    case CLOSE_CHAT_TAB:

      const findTab = state.tabs.find((t) => t.id === action.payload)
      if (findTab && findTab.group_id) {
        remove(findTab.group_id)
      }

      let tt = state.tabs.filter((t) => t.id !== action.payload)

      return {
        ...state,
        tabs: tt,
        active: _.get(state.active, 'id') === action.payload ? null : state.active
      }

    case UPDATE_CHAT_TAB:

      const gid = _.get(action.payload, 'group_id')

      if (gid) {
        save(gid)
      }

      let ttt = [...state.tabs]

      ttt = ttt.map((i) => {

        if (i.id === action.payload.id) {
          return action.payload
        }

        return i
      })

      return {
        ...state,
        tabs: ttt
      }

    default:

      return state
  }
}