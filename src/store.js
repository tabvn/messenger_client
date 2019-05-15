import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import reducers from './redux/reducers'
import Service from './service'
import {api} from './config'
import {INIT_APP} from './redux/types'
import _ from 'lodash'
import {initLoad} from './redux/actions'
import MessengerConnect from './service/messenger-connect'
import LocalEvent from './service/local-event'
import axios from 'axios'

const service = new Service(api)
const event = new LocalEvent()

export const store = createStore(
    reducers,
    applyMiddleware(thunk.withExtraArgument({service, event})),
)

const requestData = new FormData()

requestData.append('js_module', 'ar_react')
requestData.append('js_callback', 'messenger_auth')
axios.post(`https://tree.addictionrecovery.com/server.php`, requestData).
    then(res => {
      const initStore = _.get(res.data, 'data')
      store.dispatch({
        type: INIT_APP,
        payload: initStore,
      })
      service.setApiUrl(_.get(initStore, 'api.url'))
      service.setStore(store)
      service.setToken(_.get(initStore, 'account'))
      store.dispatch(initLoad())

    })

// Allow Drupal call from outside

const connect = new MessengerConnect(store)
window.messenger = connect