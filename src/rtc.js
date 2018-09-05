let RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection
let RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription
navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.mediaDevices.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia

let localStream = null

class RTC {
  constructor () {

    this.getUserMedia = this.getUserMedia.bind(this)
  }

  getUserMedia = (cb) => {


    return cb(null,null)

    if (localStream) {
      return cb(null, localStream)
    }

    navigator.mediaDevices.getUserMedia({'audio': true, 'video': true}).then((stream) => {

      localStream = stream
      return cb(null, stream)

    }).catch((err) => {
      return cb(err)
    })

  }

  removeStream = () => {
    if (localStream) {
      localStream.getTracks().forEach(function (track) {
        track.stop()
      })
      localStream = null
    }

  }
}

export default new RTC()