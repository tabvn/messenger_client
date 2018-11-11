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
import WebScreenshot from './web-screenshot'

const Container = styled.div`
  position: relative;
  z-index:0;
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
    .messenger-body-tooltip{
      display: block;
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

const ArrowBox = styled.div`
  color: #FFF;
  position: relative;
	background: #000000;
	border: 1px solid #000000;
	border-radius: 5px;
	padding: 5px 10px;
	&:after,&:before{
	  top: 100%;
	  left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
	}
	&:after{
	  border-color: rgba(0, 0, 0, 0);
	  border-top-color: #000000;
	  border-width: 5px;
	  margin-left: -5px;
	}
	&:before{
	  border-color: rgba(0, 0, 0, 0);
	  border-top-color: #000000;
	  border-width: 6px;
	  margin-left: -6px;
	}
`

const ToolTip = styled.div`
  display: none;
  color: #FFF;
  font-size: 18px;
  position: absolute;
  top: -37px;
  left: 10px;
  z-index: 2;
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

    const updated = _.get(message, 'updated', null)
    if (updated && _.get(message, 'created') !== updated) {

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

    const {message, currentUser, dock, tooltipMessage} = this.props

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

    let urls = _.get(message, 'body', '').match(/\bhttps?:\/\/\S+/gi)
    urls = _.uniq(urls)

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
        <ToolTip className={'messenger-body-tooltip'}>
          <ArrowBox>
            {
              tooltipMessage
            }
          </ArrowBox>
        </ToolTip>
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

        {
          urls.map((url, index) => {
            return <WebScreenshot key={index} url={url}/>
          })
        }

      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.app.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setAttachmentModal,
  deleteMessage,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBody)