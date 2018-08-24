import React, { Fragment } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import MessageAttachment from './message-attachment'
import { replaceUrls, setAttachmentModal } from '../redux/actions'
import MessageFiles from './message-files'
import MessageGif from './message-gif'

const Container = styled.div`
  padding: 0 0 0 10px;
  flex-grow: 1;
`

const Text = styled.div`
  color: ${props => props.color};
  padding: 15px;
  border-radius: 8px;
  background: ${props => props.background};
  .message-text{
    color: ${props => props.color};
    font-weight: 300;
    a{
      color: ${props => props.hrefColor};
    }
  }
`

const P = styled.div`
  font-size: 21px;
  a{
    color: #f8c231;
  }
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

class MessageBody extends React.Component {

  renderText () {

    const {message} = this.props
    let body = _.get(message, 'body', '')

    if (body) {
      body = replaceUrls(body)
    }
    const items = _.split(body, '\n')

    return <Fragment>
      {
        items.map((line, key) => {

          return <P className={'message-text'} key={key} dangerouslySetInnerHTML={{__html: line}}/>
        })
      }
    </Fragment>
  }

  handleOpenAttachmentModal = (attachments, selected) => {

    const {message} = this.props

    this.props.setAttachmentModal(message.group_id, attachments, selected, true)
  }

  render () {

    const {message, currentUser} = this.props

    const messageBackground = currentUser.id === message.user_id ? '#12416a' : '#e1e1e1'
    const messageColor = currentUser.id === message.user_id ? '#FFF' : '#4b4b4b'
    const linkColor = currentUser.id === message.user_id ? 'rgb(248, 194, 49)' : 'rgb(18, 65, 106)'

    let attachments = _.get(message, 'attachments', [])
    if (!attachments) {
      attachments = []
    }

    const files = _.get(message, 'files', [])
    const gif = _.get(message, 'gif')
    const isEmoji = _.get(message, 'emoji', false)

    return (
      <Container className={'message-body'}>
        {
          _.trim(_.get(message, 'body', '')) !== '' ?
            isEmoji ? <Emoji className={'message-emoticon'}>{message.body}</Emoji> :
              <Text
                hrefColor={linkColor}
                color={messageColor} background={messageBackground} className={'message-text'}>
                {this.renderText()}
              </Text> : null
        }
        {
          gif !== '' && (
            <MessageGif gif={gif}/>
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

const mapStateToProps = (state) => ({
  currentUser: state.app.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setAttachmentModal
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBody)