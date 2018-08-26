import React, { Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMessageUser } from '../redux/selector/message'
import MessageUserAvatar from './message-user-avatar'
import MessageBody from './message-body'
import _ from 'lodash'
import { sendMessage } from '../redux/actions'

const Container = styled.div`
  height: min-content;
  padding: 10px 20px 10px 10px;
  .message-inner{
    display:flex;
    flex-direction: row;
    opacity: ${props => props.opacity};
  }
  
`

const Actions = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
const Error = styled.div`
  font-size: 12px;
  color: rgb(255, 0, 0);
`

const Resend = styled.button`
  cursor: pointer;
  background: #f8c231;
  border: 0 none;
  color: #FFF;
  font-size: 12px;
  padding: 5px;
  margin-left: 5px;
  border-radius: 5px;
`

class Message extends React.Component {

  render () {

    const {message, user, hideAvatar, dock} = this.props

    let isEmptyMessage = false

    if (_.trim(message.body) === '' && message.gif === '' && !_.get(message, 'attachments', []).length) {
      isEmptyMessage = true
    }

    const status = _.get(message, 'status')

    let opacity = 1
    if (status === 'sending' || status === 'error') {
      opacity = 0.2
    }

    return (
      <Fragment>
        {
          isEmptyMessage ? null : (
            <Container
              opacity={opacity}
              className={'ar-message'}>
              <div className={'message-inner'}>
                <MessageUserAvatar hide={hideAvatar} user={user}/>
                <MessageBody onEdit={(message) => {

                  if(this.props.onEdit){
                    this.props.onEdit(message)
                  }

                }} dock={dock} user={user} message={message}/>
              </div>

              {
                status === 'error' ? (
                  <Actions className={'message-actions'}>
                    <Error className={'message-not-delivered'}>Not Delivered</Error>
                    <Resend onClick={() => {
                      this.props.sendMessage(message, _.get(message, 'group'), _.get(message, 'userIds'))

                    }} className={'re-send'}>Resend</Resend>
                  </Actions>
                ) : null
              }

            </Container>
          )
        }
      </Fragment>
    )
  }
}

const mapStateToProps = (state, props) => ({
  user: getMessageUser(state, props),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  sendMessage
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Message)