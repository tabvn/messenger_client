import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ModalLayout from './modal-layout'
import _ from 'lodash'
import styled from 'styled-components'
import { openChat } from '../redux/actions'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  justify-content: center;
  color: #000000;
  font-size: 15px;
`
const Button = styled.button`
  background: #818181;
  color: #FFF;
  fonts-size: 15px;
  font-weight: 700;
  padding: 10px 18px;
  text-align: center;
  margin:0;
  outline: 0 none;
  border: 0 none;
  border-radius: 5px;
  cursor: pointer;
  &:active,&:focus{
    outline: 0 none;
  }
  &.btn-color{
    background: #2397e8;
    margin-left: 10px;
  }
  &:hover{
    opacity: 0.88;
  }
`

const Actions = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: row;
`

class GroupUserRemoveModal extends React.Component {

  render () {
    const {onClose, removeBy} = this.props
    return (
      <ModalLayout onClose={onClose ? onClose : null}>
        <Container className={'remove-group-user-container'}>
          {`${_.get(removeBy, 'first_name')} ${_.get(removeBy, 'last_name')}`} has removed you from this group
          <Actions className={'remove-group-user-actions'}>
            <Button onClick={() => {
              // open chat modal
              this.props.sendMessage(removeBy)
              if (onClose) {
                onClose()
              }

            }} className={'btn-cancel'}>Send them a message</Button>
            <Button onClick={onClose ? onClose : null} className={'btn-color'}>It's ok</Button>
          </Actions>
        </Container>
      </ModalLayout>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  sendMessage: (user) => {
    return (dispatch, getState) => {

      const usr = getState().user.find((u) => u.id === user.id)
      if (usr) {
        dispatch(openChat([usr]))
      } else {
        dispatch(openChat([user]))
      }
    }
  }
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GroupUserRemoveModal)