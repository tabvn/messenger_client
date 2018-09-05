import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import MessageAttachment from './message-attachment'
import { deleteMessage, replaceUrls, setAttachmentModal } from '../redux/actions'
import MessageFiles from './message-files'
import MessageGif from './message-gif'
import Menu from './menu'

const Container = styled.div`
  padding: 0 0 0 10px;
  flex-grow: 1;
  max-width: ${props => props.dock ? '300px;' : '590px'};
  .messenger-menu{
    visibility: hidden;
  }
  &:hover{
    .messenger-menu{
      visibility: visible;
    }
  }
`

const Text = styled.div`
  color: ${props => props.color};
  padding: 15px;
  border-radius: 8px;
  background: ${props => props.background};
  display: flex;
  flex-direction: row;
  .message-text-inner{
    flex-grow: 1;
    color: ${props => props.color};
    font-weight: 300;
    a{
      color: ${props => props.hrefColor};
      word-break: break-all; 
      display: inline-block;
    }
  }
`

const EmojiContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end; 
  
`
const Emoji = styled.div`
  vertical-align: middle;
  font-size: 50px;
  text-align: right;
  transition: -webkit-transform 60ms ease-out;
  transition: transform 60ms ease-out;
  transition: transform 60ms ease-out, -webkit-transform 60ms ease-out;
  transition-delay: 60ms;
  font-family: Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;
`

const BodyInner = styled.div`
  flex-grow: 1;
  font-size: 18px;
  .message-edited{
    color: inherit;
    font-size: 16px;
    font-style: italic;
    font-weight: 100;
  }

`

class MessageBody extends React.Component {

  renderText () {

    const {message} = this.props
    let body = _.get(message, 'body', '')

    if (body) {
      body = replaceUrls(body)
    }
    const items = _.split(body, '\n')

    let text = ''
    items.map((line, key) => {

      if (key === 0) {
        text = `${text} ${line}`
      } else {
        text = `${text} <br /> ${line}`
      }
      return line
    })

    if (_.get(message, 'created') !== _.get(message, 'updated')) {

      text = `${text} <span class="message-edited">(edited)</span>`
    }

    return text ? <BodyInner className={'message-text-inner'} dangerouslySetInnerHTML={{__html: text}}/> : null
  }

  handleOpenAttachmentModal = (attachments, selected) => {

    const {message} = this.props

    this.props.setAttachmentModal(message.group_id, attachments, selected, true)
  }

  handleMenuAction = (select) => {

    const {message} = this.props

    switch (select.action) {

      case 'delete':

        this.props.deleteMessage(message.id, true)

        break

      case 'edit':

        if (this.props.onEdit) {
          this.props.onEdit(message)
        }

        break

      default:

        break
    }
  }

  render () {

    const {message, currentUser, dock} = this.props

    const currentUserId = _.get(currentUser, 'id')
    const messageBackground = currentUserId === message.user_id ? '#12416a' : '#e1e1e1'
    const messageColor = currentUserId === message.user_id ? '#FFF' : '#4b4b4b'
    const linkColor = currentUserId === message.user_id ? 'rgb(248, 194, 49)' : 'rgb(18, 65, 106)'
    const status = _.get(message, 'status')
    const isSent = status !== 'sending' && status !== 'error'

    let attachments = _.get(message, 'attachments', [])
    if (!attachments) {
      attachments = []
    }

    const files = _.get(message, 'files', [])
    const gif = _.get(message, 'gif')
    const isEmoji = _.get(message, 'emoji', false)

    let actionItems = [

      {

        title: 'Delete',
        icon: 'delete',
        action: 'delete'
      }
    ]

    if (currentUserId === message.user_id) {
      actionItems = [
        {

          title: 'Edit',
          icon: 'edit',
          action: 'edit'
        },
        {
          title: 'Delete',
          icon: 'delete',
          action: 'delete'
        }
      ]
    }

    return (
      <Container
        dock={dock}
        className={'message-body'}>
        {
          _.trim(_.get(message, 'body', '')) !== '' ?
            isEmoji ?
              <EmojiContainer>
                <Emoji className={'message-emoticon'}>
                  {message.body}
                </Emoji>
                {isSent && <Menu onClick={this.handleMenuAction} items={actionItems}/>}
              </EmojiContainer> :
              <Text
                hrefColor={linkColor}
                color={messageColor} background={messageBackground} className={'message-text'}>
                {this.renderText()}
                {isSent && <Menu onClick={this.handleMenuAction} items={actionItems}/>}
              </Text> : null
        }
        {
          gif !== '' && (
            <MessageGif sent={isSent} onDelete={this.handleMenuAction} gif={gif}/>
          )
        }

        {
          attachments.map((attachment, index) => {
            return (
              <MessageAttachment
                onClick={() => {
                  this.handleOpenAttachmentModal(attachments, attachment)
                }}
                attachment={attachment} key={index}/>
            )
          })
        }
        {
          files.length ? <MessageFiles files={files}/> : null

        }

      </Container>
    )
  }
}

const
  mapStateToProps = (state) => ({
    currentUser: state.app.user,
  })

const
  mapDispatchToProps = (dispatch) => bindActionCreators({
    setAttachmentModal,
    deleteMessage,
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBody)