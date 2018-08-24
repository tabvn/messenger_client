import { CHANGE_SIDEBAR_TAB_INDEX, ON_CREATE_GROUP, SET_SIDEBAR_SEARCH, TOGGLE_SIDEBAR } from '../types'
import { EventEmitter } from 'fbemitter'

const initState = {
  open: false,
  activeTabIndex: 0,
  search: '',
  event: new EventEmitter()
}

export default (state = initState, action) => {

  switch (action.type) {

    case TOGGLE_SIDEBAR:

      const value = action.payload === false || action.payload === true ? action.payload : !state.open
      return {
        ...state,
        open: value,
        activeTabIndex: value === false ? 0 : state.activeTabIndex

      }

    case CHANGE_SIDEBAR_TAB_INDEX:

      return {
        ...state,
        activeTabIndex: action.payload
      }

    case SET_SIDEBAR_SEARCH:

      return {

        ...state,
        search: action.payload
      }


    case ON_CREATE_GROUP:


      state.event.emit(ON_CREATE_GROUP, action.payload)

      return state

    default:

      return state
  }
}