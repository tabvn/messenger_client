import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import reducers from './redux/reducers'
import Service from './service'
import { api } from './config'
import { INIT_APP } from './redux/types'
import _ from 'lodash'
import { initLoad } from './redux/actions'
import MessengerConnect from './service/messenger-connect'
import LocalEvent from './service/local-event'

const service = new Service(api)
const event = new LocalEvent()

export const store = createStore(
  reducers,
  applyMiddleware(thunk.withExtraArgument({service, event}))
)

let initStore = {}

if (typeof window.__INIT_STORE !== 'undefined') {
  try {
    initStore = JSON.parse(window.__INIT_STORE)

  } catch (err) {
    console.log('An error load init store.')
  }
}

store.dispatch({
  type: INIT_APP,
  payload: initStore
})

service.setStore(store)
service.setToken(_.get(initStore, 'account'))

// load init data
store.dispatch(initLoad())

// Allow Drupal call from outside

const connect = new MessengerConnect(store)
window.messenger = connect