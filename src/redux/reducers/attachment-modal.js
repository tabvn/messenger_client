import { CLOSE_ATTACHMENT_MODAL, SET_ATTACHMENT_MODAL, SET_SELECTED_ATTACHMENT_MODAL } from '../types'

const initState = {
  attachments: [],
  open: false,
  selected: null
}
export default (state = initState, action) => {

  switch (action.type) {

    case SET_ATTACHMENT_MODAL:

      const payload = action.payload

      return {
        ...state,
        attachments: payload.attachments,
        open: payload.open,
        selected: payload.selected ? payload.selected : state.selected
      }

    case CLOSE_ATTACHMENT_MODAL:

      return {
        ...state,
        open: false,
        attachments: []
      }

    case SET_SELECTED_ATTACHMENT_MODAL:

      return {
        ...state,
        selected: action.payload
      }

    default:

      return state
  }
}