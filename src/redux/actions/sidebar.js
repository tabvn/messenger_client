import { CHANGE_SIDEBAR_TAB_INDEX, ON_CREATE_GROUP, SET_SIDEBAR_SEARCH, TOGGLE_SIDEBAR } from '../types'

export const toggleSidebar = (open = null) => {
  return (dispatch) => {

    if (open) {

      document.body.classList.remove('ar-messenger-sidebar-closed')
      document.body.classList.add('ar-messenger-sidebar-open')

    } else {
      document.body.classList.remove('ar-messenger-sidebar-open')
      document.body.classList.add('ar-messenger-sidebar-closed')
    }

    dispatch({
      type: TOGGLE_SIDEBAR,
      payload: open
    })
  }
}

export const changeSidebarTab = (index = 0) => {
  return (dispatch) => {

    dispatch({
      type: CHANGE_SIDEBAR_TAB_INDEX,
      payload: index
    })
  }
}

export const setSidebarSearch = (search = '') => {
  return (dispatch) => {

    dispatch({
      type: SET_SIDEBAR_SEARCH,
      payload: search
    })
  }
}

export const onCreateGroup = () => {
  return (dispatch) => {

    dispatch({
      type: ON_CREATE_GROUP,
      payload: null
    })
  }
}