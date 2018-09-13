import { CLOSE_MODAL, OPEN_MODAL } from '../types'

export default (state = {
  title: null,
  close: null,
  component: null,
  open: false,
  onClose: null,
  className: null,

}, action) => {

  switch (action.type) {

    case OPEN_MODAL:

      const payload = action.payload

      return {

        ...state,
        title: payload.title,
        component: payload.component,
        open: payload.open,
        close: payload.close,
        onClose: payload.onClose,
        className: payload.className,
        name: payload.name,
      }

    case CLOSE_MODAL:

      if (state.onClose) {
        state.onClose()
      }
      return {
        ...state,
        title: null,
        close: null,
        open: false,
        onClose: null,
        component: null,
        className: null,
      }
    default:

      return state
  }
}