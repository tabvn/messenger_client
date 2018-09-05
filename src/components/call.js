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
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  video{
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`

const ActiveVideo = styled.div`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 640px;
  height: 480px;
  background: #0096e3;
`

const Videos = styled.div`
  
`

const c = {iceServers: [{'url': 'stun:stun.l.google.com:19302'}]}

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

  componentDidMount () {

    const {currentUser} = this.props
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
      this.setState({
        streams: {
          ...this.state.streams,
          [currentUser.id]: URL.createObjectURL(stream)
        }
      })

    })

  }

  componentWillUnmount () {
    rtc.removeStream()
  }

  isMute = (userId) => {
    const {currentUser} = this.props

    if (userId === currentUser.id) {
      return true
    }

    return _.get(this.state.muted, userId)
  }

  handleEndCall = () => {
    rtc.removeStream()
    this.props.callEnd()

  }

  render () {

    let {active} = this.state

    if (!active) {
      active = this.props.currentUser.id
    }
    const activeUser = this.state.joined.find((u) => u.id === active)

    const users = this.state.joined.filter((u) => u.id !== active)

    return (
      <Container className={'caller'}>
        {activeUser ?
          <ActiveVideo className={'active-video'}>
            <video src={_.get(this.state.streams, activeUser.id)} controls={false} muted={this.isMute(activeUser.id)}
                   autoPlay={true}
                   ref={this.getRef(activeUser.id)}
                   className={`call-video video-user-${activeUser.id}`}/>
          </ActiveVideo>
          : null}

        <Videos>{
          users.map((user, index) => {
            return <video src={_.get(this.state.streams, user.id)} controls={false} muted={this.isMute(user.id)}
                          autoPlay={true} key={index}
                          ref={this.getRef(user.id)}
                          className={`call-video video-user-${user.id}`}/>
          })
        }
        </Videos>
        <CallActions onEnd={this.handleEndCall}/>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  callEnd
}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Call)