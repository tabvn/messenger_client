import React, {Fragment} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import ComposerAttachments from './composer-attachments'
import ConnectionInfo from './connection-info'

const Container = styled.div`
  border-top: 1px solid #e8e8e8;
  position: relative;
  background: #FFF;
  pre{
    visibility: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 5px;
    background: none;
    border: 0 none;
    outline: 0;
    line-height: 1.33;
  }
  
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(0,0,0,0.05);
  cursor: not-allowed;
`

const Inner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 60px;
  max-height: 200px;
  .composer-input-container{
    flex-grow: 1;
    position: relative;
    max-height: 150px;
    max-width: 100%;
    overflow: hidden;
  }
  .composer-input{
    min-height: 50px;
    resize: none;
    padding: 5px;
    color: #c4c4c4;
    font-size: 21px;
    font-weight: 300;
    border: 0 none;
    width: 100%;
    height: 100%;
    max-width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
    outline: 0 none;
    transition: background-color ease 200ms, box-shadow ease 200ms, -webkit-box-shadow ease 200ms;
    position: absolute;
    bottom: 0;
    left: 0;
    &:focus,&:active{
      outline: 0 none;
    }
    &::placeholder{
      line-height: 50px;
    }
  }
  .attachment-tools{
    position: relative;
    overflow: hidden;
    border: 0 none;
    outline: 0 none;
    background: none;
    color: #c4c4c4;
    padding: 0px;
    margin: 0 3px;
    cursor: pointer;
    i{
      color: #c4c4c4;
    }
    input{
      position: fixed;
      top: -9999px;
    }
  }
`

const Tools = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 10px;
  align-items: center;

`
const Button = styled.button`
  border: 0 none;
  outline: 0 none;
  background: none;
  color: #c4c4c4;
  padding: 0px;
  margin: 0 3px;
  cursor: pointer;
  &:focus,&:active{
      outline: 0 none;
  }
  i{
    color: #c4c4c4;
    font-size: 25px;
  }
  &.add-tool{
    color: #f8c231;
    i{
      color: #f8c231;
    }
  }
  &.gif-tool{
    display: flex;
    i{
      border: 1px solid #c4c4c4;
      line-height: 15px;
      border-radius: 8px;
    }
  }
  &.send{
    color: #f8c231;
    i{
      color: #f8c231;
    }
  }
`

const emotions = [
  {
    w: ':)',
    r: '😊',
  },
  {
    w: ':(',
    r: '😟',
  },
  {
    w: ':[',
    r: '😳',
  },
  {
    w: ':@',
    r: '😷',
  },
  {
    w: ':*',
    r: '😘',
  },
  {
    w: ';)',
    r: '😉',
  },
  {
    w: 'B)',
    r: '😎',
  },
  {
    w: ':D',
    r: '😃',
  },
  {
    w: 'D:',
    r: '😩',
  },
  {
    w: ':p',
    r: '😛',
  },
  {
    w: '(y)',
    r: '👍',
  },
  {
    w: '(n)',
    r: '👎',
  },
  {
    w: '<3',
    r: '❤️',
  },
  {
    w: ':o',
    r: '😮️',
  },
  {
    w: ':s',
    r: '😖',
  }, {
    w: ':|',
    r: '😐',
  },

]

const lists = emotions.map((e) => {

  return e.r
})

const typingTimeOut = 2500

export default class Composer extends React.Component {

  state = {
    placeholder: true,
    gif: '',
    message: '',
    emoji: false,
    isTyping: false,
  }

  componentDidMount() {
    window.addEventListener('click', this.finishTyping)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.finishTyping)
  }

  finishTyping = () => {

    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (this.state.isTyping) {
      this.setState({
        isTyping: false,
      }, () => {
        if (this.props.onEndTyping) {
          this.props.onEndTyping()
        }
      })
    }
  }

  handleOnKeyUp = (e) => {

    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(this.finishTyping.bind(this), typingTimeOut)

    if (!this.state.isTyping) {
      this.setState({
        isTyping: true,
      }, () => {

        if (this.props.onTyping) {
          this.props.onTyping()
        }

      })
    }
  }
  replaceEmoji = (message) => {

    if (!message || message === '') {
      return message
    }

    let replacedMessage = message

    emotions.forEach((e) => {
      replacedMessage = replacedMessage.replace(e.w, e.r)
    })

    return replacedMessage
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.emoji && this.props.onClearEmoji) {
      this.props.onClearEmoji()
    }

    if (this.props.emoji && prevProps.emoji !== this.props.emoji) {
      this.handleAddEmoji(this.props.emoji)
    }

    if (this.props.edit && prevProps.edit !== this.props.edit &&
        _.get(prevProps.edit, 'id') !== _.get(this.props.edit, 'id')) {
      this.setState({
        message: this.props.edit.body,
      })
    }
  }

  handleAddEmoji = (emoji) => {

    const {message} = this.state

    this.setState({
      message: _.trim(`${message}${emoji}`),
      emoji: message === '' ? true : this.state.emoji,
    })

  }
  resetMessage = () => {

    this.setState({
      message: '',
      emoji: false,
      attachments: [],
    })
  }
  send = () => {

    let isEmojoi = this.state.emoji

    if (_.includes(lists, this.state.message)) {
      isEmojoi = true
    }
    const message = {
      body: this.state.message,
      emoji: isEmojoi,
      attachments: [],
    }

    if (this.props.onSend) {
      this.props.onSend(message)
      this.resetMessage()

    }
  }

  onChange = (e) => {
    const v = e.target.value
    this.setState({
      message: this.replaceEmoji(v),
      emoji: false,
    })
  }

  onClickInside = (e) => {

    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }
  onAddFiles = (e) => {
    const files = e.target.files
    if (this.props.onAddFiles) {
      this.props.onAddFiles(files)
    }
  }

  render() {
    const {message, gif} = this.state
    const {files, isNew, edit} = this.props

    const inputId = _.uniqueId('input')

    let allowSend = false
    let allowActions = true

    if (_.trim(message) !== '' || files.length || _.trim(gif) !== '') {
      allowSend = true
      allowActions = false
    }

    if (edit) {
      allowActions = false
    }

    return (
        <Container className={'composer'}>
          {isNew && <Overlay/>}
          <ComposerAttachments
              onRemove={(file) => {
                if (this.props.onRemoveFile) {
                  this.props.onRemoveFile(file)
                }
              }}
              files={files}/>
          <Inner className={'composer-inner'} onClick={this.onClickInside}>
            <ConnectionInfo/>
            <div className={'composer-input-container'}>
              <pre>{message}</pre>
              <textarea
                  onKeyUp={this.handleOnKeyUp}
                  value={message}
                  onChange={this.onChange}
                  onKeyDown={(e) => {
                    if (message === '' && e.key === 'ArrowUp' &&
                        this.props.onPressArrowUp) {
                      this.props.onPressArrowUp()

                      e.preventDefault()
                    }
                  }}
                  onKeyPress={(event) => {
                    if (event.shiftKey === false && event.key === 'Enter') {

                      event.preventDefault()
                      if (allowSend) {
                        this.send()
                      }

                    }
                  }}
                  onBlur={() => {
                    if (!message) {
                      this.setState({
                        placeholder: true,
                      })
                    }

                  }}
                  onFocus={(e) => {
                    if (!message) {
                      this.setState({
                        placeholder: false,
                      })
                    }
                    this.onClickInside(e)

                  }} className={'composer-input'}
                  placeholder={this.state.placeholder
                      ? 'Type a message...'
                      : ''}/>
            </div>
            <Tools className={'composer-tools'}>
              <Button
                  id={'chat-emoji-button'}
                  onClick={(e) => {
                    if (this.props.onOpenModal) {
                      this.props.onOpenModal('emoji', e)
                    }
                  }}
                  title={'Emoji'} className={'emotion-tool'}>
                <i className={'md-icon'}>tag_faces</i>
              </Button>
              {
                allowActions &&
                (<Fragment>
                  <Button
                      id={'chat-gif-button'}
                      onClick={(e) => {
                        if (this.props.onOpenModal) {
                          this.props.onOpenModal('gif', e)
                        }
                      }}
                      title={'GIF'} className={'gif-tool'}>
                    <i className={'md-icon'}>gif</i>
                  </Button>
                  <label className={'attachment-tools'}
                         htmlFor={`attachment-input-${inputId}`}>
                    <i className={'md-icon'}>attachment</i>
                    <input id={`attachment-input-${inputId}`}
                           onChange={this.onAddFiles} type={'file'}
                           multiple={true}/>
                  </label>
                  <Button
                      id={'chat-options-button'}
                      onClick={(e) => {
                        if (this.props.onOpenModal) {
                          this.props.onOpenModal('options', e)
                        }
                      }}
                      title={'Chat options'} className={'add-tool'}>
                    <i className={'md-icon'}>add_circle_outline</i>
                  </Button>
                </Fragment>)
              }
              {allowSend &&
              (<Button onClick={() => this.send()} className={'send'}>
                <i className={'md-icon'}>{edit ? 'save' : 'send'}</i>
              </Button>)}
            </Tools>
          </Inner>
        </Container>
    )
  }
}