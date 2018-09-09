import React from 'react'
import styled from 'styled-components'
import 'webrtc-adapter'
import rtc from '../rtc'
import _ from 'lodash'
import CallActions from './call-actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { callEnd } from '../redux/actions'

const Container = styled.div`
  position: relative;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  video{
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    max-height: 100%;
  }
  .active-video{
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    width: 640px;
    height: 480px;
    background: #0096e3;
    position: relative;
    z-index:1;
  }
  .call-videos{
    z-index:2;
    position: absolute;
    width: 100%;
    top: 390px;
    justify-content: flex-end;
    right: 0;
    left:0;
    height: 90px;
    display: flex;
    flex-direction: row;
    video{
      width: 120px;
      height: 90px;
      border-radius: 0;
    }
  }
`

const rtcConfig = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    }
  ]
}

let peers = {}
let videoElements = {}
let streams = {}
let activeVideoUserId = null

const logError = (err) => {
  console.log('Log Error:', err)
}

class Call extends React.Component {

  videoRefs = {}

  state = {
    joined: [],
    muted: {},
    streams: {},
    active: null
  }

  join = (user) => {

    this.createRef(user.id)

    let joined = this.state.joined
    if (!joined.find((u) => u.id === user.id)) {
      joined.push(user)
    }

    this.setState({
      joined: joined
    })
  }

  getRef = (userId) => {

    return this.videoRefs[userId]

  }

  createRef = (userId) => {

    let ref = this.getRef(userId)

    if (!ref) {
      ref = React.createRef()
      this.videoRefs[userId] = ref

    }

    return ref

  }

  getUserMediaStream = (cb) => {

    rtc.getUserMedia((err, stream) => {

      if (err) {
        return cb(err)
      }

      return cb(null, stream)
    })
  }

  setVideoStream = (userId, stream, active = false) => {
    const {currentUser} = this.props

    const activeContainer = document.getElementById('active-video')
    const videosContainer = document.getElementById('call-videos')
    let videoElm = document.getElementById(`video-${userId}`)


    if(activeVideoUserId === currentUser.id && activeVideoUserId !== userId){
      active = true
    }

    if (videoElm) {
      videoElm.parentNode.removeChild(videoElm)
    }

    if (active) {

      if (activeVideoUserId && userId !== activeVideoUserId) {
        // let move active video to the bottom
        this.setVideoStream(activeVideoUserId, streams[activeVideoUserId], false)
      }
      activeVideoUserId = userId
    }

    const elm = document.createElement('video')
    elm.autoplay = true
    elm.muted = currentUser.id === userId
    elm.controls = false
    elm.playsinline = true
    elm.setAttribute('playsinline', true)
    elm.id = `video-${userId}`
    elm.onclick = () => {
      if (!active) {

        this.setVideoStream(userId, stream, true)
      }

    }

    videoElements[userId] = elm

    if (active) {
      if (this.activeRef) {
        this.activeRef.style.background = 'none'
      }
      activeContainer.appendChild(elm)
    }
    else {
      videosContainer.appendChild(elm)
    }

    elm.srcObject = stream
    streams[userId] = stream

  }

  componentDidMount () {

    const {currentUser, caller} = this.props
    this.join(currentUser)

    // current user local stream
    this.getUserMediaStream((err, stream) => {

      if (err) {
        alert(err)

        return
      }
      if (!stream) {
        return
      }

      this.setVideoStream(currentUser.id, stream, true)

    })

    if (currentUser.id !== caller.id) {
      const pc = peers[caller.id]
      if (!pc) {

        this.createPeerConnection(caller.id, false)

        this.props.subscribe(`call_exchange/${caller.id}`, (data) => {

          this.exchange(data, caller.id)
        })
      }

    }

    this.props.subscribe('call_join', (user) => {

      this.join(user)

      this.onUserJoined(user)
    })

  }

  onUserJoined = (user) => {

    this.createPeerConnection(user.id, true)

    this.props.subscribe(`call_exchange/${user.id}`, (data) => {

      this.exchange(data, user.id)
    })

  }

  createPeerConnection = (userId, isOffer) => {

    const {currentUser} = this.props

    let pc = new RTCPeerConnection(rtcConfig)

    peers[userId] = pc

    const _this = this

    pc.onicecandidate = (event) => {

      // console.log('onicecandidate', event.candidate)

      if (event.candidate) {

        const payload = {
          action: 'call_exchange',
          payload: {
            to: userId,
            from: currentUser.id,
            candidate: event.candidate,
          }
        }
        _this.props.send(payload)

      }

    }
    pc.onnegotiationneeded = function () {

      if (isOffer) {
        createOffer()
      }
    }

    pc.oniceconnectionstatechange = function (event) {

      //disconnected,failed
      if (event.target.iceConnectionState === 'connected') {
        createDataChannel()
      }
    }

    function createOffer () {

      pc.createOffer(function (desc) {

        pc.setLocalDescription(desc, function () {

          //socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription});

          const payload = {
            action: 'call_exchange',
            payload: {
              to: userId,
              from: currentUser.id,
              sdp: pc.localDescription
            }
          }

          _this.props.send(payload)

        }, logError)
      }, logError)
    }

    const createDataChannel = () => {
      if (pc.textDataChannel) {
        return
      }
      const dataChannel = pc.createDataChannel('text')

      dataChannel.onerror = function (error) {
        console.log('dataChannel.onerror', error)
      }

      dataChannel.onmessage = function (event) {

        // container.receiveTextData({user: socketId, message: event.data});
      }

      dataChannel.onopen = function () {
        console.log('dataChannel.onopen')
        //container.setState({textRoomConnected: true});
      }

      dataChannel.onclose = function () {
        console.log('dataChannel.onclose')
      }

      pc.textDataChannel = dataChannel

    }
    pc.onaddstream = function (event) {

      _this.setVideoStream(userId, event.stream)

    }
    pc.onsignalingstatechange = function (event) {

    }

    pc.onremovestream = function (event) {

    }
    pc.onclose = () => {
      console.log(`${userId} closed`)
      _.unset(streams, userId)
      _.unset(peers, userId)
      if (activeVideoUserId === userId) {
        // remove active
        this.setVideoStream(currentUser.id, streams[currentUser.id], true)
      }
    }

    const localStream = rtc.getLocalStream()
    if (localStream) {
      pc.addStream(localStream)
    }

    if (isOffer) {
      createOffer()
    }

    return pc

  }

  componentWillUnmount () {

    streams = {}
    peers = {}
    rtc.removeStream()
  }

  handleEndCall = () => {
    streams = {}
    peers = {}
    rtc.removeStream()
    this.props.callEnd()

  }

  exchange = (data, userId) => {

    const {currentUser} = this.props

    const _this = this

    let pc

    if (userId in peers) {
      pc = peers[userId]
    } else {
      pc = this.createPeerConnection(userId, false)
    }

    if (data.sdp) {

      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
        if (pc.remoteDescription.type === 'offer')
          pc.createAnswer(function (desc) {

            pc.setLocalDescription(desc, function () {

              //_this.props.broadcast(exchangeTopic, {sdp: pc.localDescription});

              const payload = {
                action: 'call_exchange',
                payload: {
                  to: userId,
                  from: currentUser.id,
                  sdp: pc.localDescription,
                }
              }
              _this.props.send(payload)

            }, logError)
          }, logError)
      }, logError)
    } else {

      pc.addIceCandidate(new RTCIceCandidate(data.candidate))
    }

  }

  shouldComponentUpdate () {
    return false
  }

  render () {

    return (
      <Container className={'caller'}>
        <div ref={(ref) => this.activeRef = ref} id={'active-video'} className={'active-video'}/>
        <div id={'call-videos'} className={'call-videos'}/>

        <CallActions onEnd={this.handleEndCall}/>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.app.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  callEnd,
  subscribe: (topic, cb) => {
    return (dispatch, getState, {service, event}) => {
      return event.subscribe(topic, cb)
    }
  },
  send: (payload) => {
    return (dispatch, getState, {service}) => {
      service.send(payload)
    }
  }
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Call)