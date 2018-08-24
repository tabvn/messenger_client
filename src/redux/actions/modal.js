import { CLOSE_MODAL, OPEN_MODAL } from '../types'

export const openModal = (component = null, title = null, close = null, open = true, onClose) => {

  return (dispatch) => {

    dispatch({
      type: OPEN_MODAL,
      payload: {
        component: component,
        title: title,
        open: open,
        close: close,
        onClose: onClose,
      }
    })
  }
}


export const closeModal = () => {

  return (dispatch) => {
    return dispatch({
      type: CLOSE_MODAL,
      payload: false
    })
  }
}