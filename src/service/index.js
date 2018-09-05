import _ from 'lodash'
import { GraphQLClient } from 'graphql-request'
import axios from 'axios'
import { handleReceiveWsMessage } from '../redux/actions'

export default class Service {
  constructor (url) {
    this.url = url
    this.token = null

    this.client = new GraphQLClient(`${this.url}/api`, {
      headers: {},
    })

    // webSocket
    this.wsUrl = this._wsUrl(`${url}/ws`)
    this.ws = null
    this._isReconnecting = false
    this._connected = false
    this._queue = []

    this.connect()

    this.store = null

  }

  setStore = (store) => {
    this.store = store
  }
  connect = () => {

    this.ws = new WebSocket(this.wsUrl)

    // clear timeout of reconnect
    if (this._reconnectTimeout) {
      clearTimeout(this._reconnectTimeout)
    }

    this.ws.onopen = () => {

      // change status of connected
      this._connected = true
      this._isReconnecting = false

      this.auth()
      this.sendQueue()

    }

    this.ws.onmessage = (message) => {

      if (typeof message.data === 'string') {

        this.store.dispatch(handleReceiveWsMessage(message.data))
      }

    }

    this.ws.onerror = (err) => {

      console.log('error', err)

      this._connected = false
      this._isReconnecting = false
      this.reconnect()

    }
    this.ws.onclose = (e) => {

      this._connected = false
      this._isReconnecting = false
      this.reconnect()

    }

  }
  sendQueue = () => {
    if (this._queue.length) {
      this._queue.forEach((q, index) => {
        this.send(q.payload)
        delete this._queue[index]
      })
    }
  }

  auth () {

    if (this.token) {
      this.send({
        action: 'auth',
        payload: {
          token: this.getTokenString(),
        }
      })
    }
  }

  send (msg) {

    if (!msg) {
      return
    }

    if (this._connected === true && this.ws.readyState === 1) {
      const message = JSON.stringify(msg)

      this.ws.send(message)
    } else {
      this._queue.push({
        type: 'message',
        payload: msg,
      })
    }

  }

  _wsUrl = (url) => {
    url = _.replace(url, 'http://', 'ws://')
    url = _.replace(url, 'https://', 'wss://')

    return url
  }

  reconnect () {

    // if is reconnecting so do nothing
    if (this._isReconnecting || this._connected) {
      return
    }
    // Set timeout
    this._isReconnecting = true
    this._reconnectTimeout = setTimeout(() => {
      console.log('Reconnecting....')
      this.connect()
    }, 2000)

  }

  setToken (token) {
    this.token = token

    // auth to socket
    this.auth()
  }

  getTokenString () {
    if (this.token == null) {
      return ''
    }

    return _.get(this.token, 'token', '')
  }

  get (url, options = null) {
    return axios.get(url, options)
  }

  request (query, variables = null) {
    this.client.setHeader('Authorization', this.getTokenString())
    return this.client.request(query, variables)
  }

  uploadPromise (file) {

    let files = Array.isArray(file) ? file : [file]

    let data = new FormData()

    for (let i = 0; i < files.length; i++) {
      data.append('files', files[i])
    }

    const url = `${this.url}/uploads?auth=${this.getTokenString()}`

    return axios.post(url, data)

  }

  upload (file, cb = () => {}) {

    let files = Array.isArray(file) ? file : [file]

    let data = new FormData()

    for (let i = 0; i < files.length; i++) {
      data.append('files', files[i])
    }

    const config = {
      onUploadProgress: (event) => {
        return cb({
          type: 'onUploadProgress',
          payload: event
        })
      }
    }

    const url = `${this.url}/uploads?auth=${this.getTokenString()}`

    axios.post(url, data, config).then((res) => {

      return cb({
        type: 'success',
        payload: res.data
      })

    }).catch((e) => {

      return cb({
        type: 'error',
        payload: e
      })
    })

  }

}