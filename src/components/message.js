import React, { Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMessageUser } from '../redux/selector/message'
import MessageUserAvatar from './message-user-avatar'
import MessageBody from './message-body'
import _ from 'lodash'
import { sendMessage } from '../redux/actions'
import moment from 'moment'

const Container = styled.div`
  height: min-content;
  padding: 10px 20px 10px 10px;
  &:first-child{
    padding-top: 30px;
  }
  .message-inner{
    display:flex;
    flex-direction: row;
    opacity: ${props => props.opacity};
    position: relative;
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

    const firstName = _.get(user, 'first_name', '')
    const lastName = _.get(user, 'last_name', '')
    const created = _.get(message, 'created')

    // check if same week we only display day and time otherwise we need show day

    const currentWeek = moment().format('WW gggg')
    const weekFormat = moment.unix(created).format('WW gggg')


    let timeDisplay

    if (currentWeek === weekFormat) {
      timeDisplay = moment.unix(created).format('ddd hh:mm a')
    } else {
      timeDisplay = moment.unix(created).format('MM/DD/YYYY, hh:mm a')
    }

    const tooltipMessage = `${firstName} - ${lastName} ${timeDisplay}`


    return (
      <Fragment>
        {
          isEmptyMessage ? null : (
            <Container
              opacity={opacity}
              className={'ar-message'}>
              <div className={'message-inner'}>
                <MessageUserAvatar tooltipMessage={tooltipMessage} created={_.get(message, 'created')} hide={hideAvatar} user={user}/>
                <MessageBody tooltipMessage={tooltipMessage} onEdit={(message) => {

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