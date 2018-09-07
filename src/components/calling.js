import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { rejectCall, answerCall } from '../redux/actions'
import { api } from '../config'

const Container = styled.div`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: #0096e3;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`

const User = styled.div`
    padding: 30px;
`

const Avatar = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid #FFF;
    img{
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 50%;
    }
    i{
      color: #FFF;
      font-size: 40px;
    }
`

const CallerName = styled.div`
  font-size: 20px;
  color: #FFF;
  font-weight: 700;
  text-align: center;
  margin: 20px 0;
`

const Actions = styled.div`

`

const Button = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid #FFF;
  border-radius: 50%;
  background: none;
  padding:0;
  margin: 10px;
  cursor: pointer;
  outline: 0 none;
  &:active,&:focus{
    outline: 0 none;
  }
  i{
    color: #FFF;
  }
  &.call-end{
    background: rgba(237,97,91,1);
    border-color: rgba(237,97,91,1);
  }
`

const Sound = styled.div`
    visibility: hidden;
    height: 0;
    overflow: hidden;
`

class Calling extends React.Component {

  componentDidMount () {
    if (this.ref) {

      this.play()
    }
  }

  play () {

    if (this.ref) {
      this.ref.pause()
      this.ref.currentTime = 0
      this.ref.volume = 0.2
      this.ref.play()
    }
  }

  render () {
    const {caller} = this.props

    const avatar = _.get(caller, 'avatar')
    return (
      <Container className={'calling'}>
        <User className={'caller'}>
          <Avatar className={'caller-avatar'}>
            {
              avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon'}>person_outline</i>
            }
          </Avatar>
          <CallerName
            className={'calling-text'}>{`${_.get(caller, 'first_name', '')} ${_.get(caller, 'last_name', '')}`}</CallerName>
        </User>
        <Actions className={'calling-actions'}>
          <Button title={'Answer video call'} className={'video-cam'} onClick={() => {
            this.props.answerCall()
          }}><i className={'md-icon'}>videocam</i></Button>
          <Button title={'Reject'} className={'call-end'} onClick={() => {
            this.props.rejectCall()
          }}><i className={'md-icon'}>call_end</i></Button>
        </Actions>

        <Sound>
          <audio ref={(ref) => this.ref = ref} id="notification-sound" controls={true} loop={true}>
            <source src={`${api}/public/call.mp3`} type="audio/mpeg"/>
            <source src={`${api}/public/call.ogg`} type="audio/ogg"/>
          </audio>
        </Sound>

      </Container>)
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  rejectCall,
  answerCall
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Calling)