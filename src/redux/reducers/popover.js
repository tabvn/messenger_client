import { EventEmitter } from 'fbemitter'
import { ON_CLOSE_POPOVER } from '../types'

const initState = {
  event: new EventEmitter()
}
export default (state = initState, action) => {
  switch (action.type) {

    case ON_CLOSE_POPOVER:

      state.event.emit(ON_CLOSE_POPOVER, action.payload)

      return state

    default:

      return state
  }
}