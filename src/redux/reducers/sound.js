import { EventEmitter } from 'fbemitter'
import { ON_PLAY_SOUND } from '../types'

export default (state = new EventEmitter(), action) => {
  switch (action.type) {

    case ON_PLAY_SOUND:

      state.emit(ON_PLAY_SOUND, true)

      return state

    default:

      return state
  }
}