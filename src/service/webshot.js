import _ from 'lodash'
import { EventEmitter } from 'fbemitter'
import axios from 'axios'

let shots = {}
let queue = []
let shotEvent = new EventEmitter()
let isRuning = false

export default class Webshot {

  constructor () {
    setInterval(() => {this.run()}, 500)
  }

  shot (url) {

    return new Promise((resolve, reject) => {
      url = _.trim(url)
      if (!url || url === '') {
        reject('Invalid url')
      }
      const shot = _.get(shots, url)
      if (shot) {
        resolve(shot)
      }

      // add to que
      this.addQueue(url)
      // subscribe to queue

      shotEvent.addListener(`shot_${url}`, (data) => {

        if (data.error) {
          reject(data.error)
        }
        resolve(data.shot)

      })

    })
  }

  addQueue (url) {
    if (!queue.find((_url) => _url === url)) {
      queue.push(url)
    }
  }

  run () {

    if (!isRuning && queue.length) {
      const url = _.get(queue, '[0]')
      isRuning = true
      // begin take new screenshot
      const requestUrl = `https://www.googleapis.com/pagespeedonline/v4/runPagespeed?screenshot=true&url=${url}`

      axios.get(requestUrl).then((res) => {

        const data = res.data

        let shot = {
          title: _.get(data, 'title', ''),
          screenshot: _.get(data, 'screenshot', null)
        }

        // cache shot
        shots[url] = shot

        let encodedData = shot.screenshot.data

        encodedData = _.replace(encodedData, /_/g, '/')

        encodedData = _.replace(encodedData, /-/g, '+')

        shot.screenshot.data = encodedData //window.atob(encodedData)

        shotEvent.emit(`shot_${url}`, {error: null, shot: shot})
        isRuning = false

        queue.splice(0,1);

        if (shots.length) {
          this.run()
        }

      }).catch((e) => {
        shotEvent.emit(`shot_${url}`, {error: e, shot: null})
        isRuning = false
        queue.splice(0,1);
        if (shots.length) {
          this.run()
        }
      })
    }

  }

}