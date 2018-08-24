import React from 'react'
import styled from 'styled-components'
import { api } from '../config'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ON_PLAY_SOUND } from '../redux/types'

const Container = styled.div`
    visibility: hidden;
    height: 0;
    overflow: hidden;
`

class Sound extends React.Component {

  componentDidMount () {

    const _this = this

    this.onPlay = this.props.event.addListener(ON_PLAY_SOUND, () => {
      _this.play()
    })

  }

  play () {

    if (this.ref) {
      this.ref.pause()
      this.ref.currentTime = 0
      this.ref.volume = 0.2
      this.ref.play()
    }
  }

  componentWillUnmount () {

    if (this.onPlay) {
      this.onPlay.remove()
    }

  }

  render () {

    return (
      <Container className={'messenger-sound-notification'}>
        <audio ref={(ref) => this.ref = ref} id="notification-sound" controls={true} loop={false}>
          <source src={`${api}/public/message.mp3`} type="audio/mpeg"/>
          <source src={`${api}/public/message.ogg`} type="audio/ogg"/>
        </audio>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  event: state.sound,
})
const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Sound)