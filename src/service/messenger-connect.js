import axios from 'axios'
import _ from 'lodash'
import { openChat, openInboxChat, setUser } from '../redux/actions'

export default class MessengerConnect {
  constructor (store) {
    this.store = store
  }

  openChat (uid) {

    axios.get(`/messenger/user/${uid}`).then((res) => {
      const user = _.get(res.data, 'data', null)
      if (user) {
        this.store.dispatch(setUser(user))

        // open chat
        this.store.dispatch(openChat([user]))
        this.store.dispatch(openInboxChat([user]))

      } else {
        console.log('User not found.')
      }

    }).catch((err) => {
      console.log('An error', err)
    })
  }
}