import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Call from './call'
import Calling from './calling'

const Container = styled.div`
  position: fixed;
  left: 10px;
  bottom: 0;
  z-index: 100000;
  width: 640px;
  height: 540px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

class VideoCall extends React.Component {

  render () {

    const {users, group, caller, accepted} = this.props.call
    return (
      caller ? (
          <Container className={'video-call'}>
            {!accepted ? <Calling caller={caller}/> : <Call currentUser={this.props.currentUser} caller={caller}
                                                            users={users}
                                                            group={group}/>}
          </Container>
        )
        : null
    )
  }
}

const mapStateToProps = (state) => ({
  call: state.call,
  currentUser: state.app.user
})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(VideoCall)