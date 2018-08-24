import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store'
import './assets/css/index.css'
import Messenger from './components/messenger'
import Inbox from './components/inbox'

const messengerElementId = document.getElementById('messenger')
const messengerInbox = document.getElementById('messenger-inbox')
if (messengerElementId) {
  ReactDOM.render(
    <Provider store={store}>
      <App>
        <Messenger/>
      </App>
    </Provider>
    , messengerElementId)
}
if (messengerInbox) {
  ReactDOM.render(
    <Provider store={store}>
      <App>
        <Inbox/>
      </App>
    </Provider>
    , messengerInbox)
}

