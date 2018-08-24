import React, { Fragment } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import ComposerAttachments from './composer-attachments'

const Container = styled.div`
  border-top: 1px solid #e8e8e8;
  position: relative;
  background: #FFF;
  
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
  .composer-input-container{
    flex-grow: 1;
  }
  .composer-input{
    resize: none;
    padding: 5px;
    color: #c4c4c4;
    font-size: 21px;
    font-weight: 300;
    border: 0 none;
    height: 50px;
    width: 100%;
    outline: 0 none;
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

export default class Composer extends React.Component {

  state = {
    placeholder: true,
    gif: '',
    message: '',
    emoji: false,

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

  componentDidUpdate (prevProps, prevState) {

    if (this.props.emoji && prevProps.emoji !== this.props.emoji) {
      this.handleAddEmoji(this.props.emoji)
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
      attachments: []
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
      emoji: false
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

  render () {
    const {message, gif} = this.state
    const {files, isNew} = this.props

    const inputId = _.uniqueId('input')

    let allowSend = false
    if (_.trim(message) !== '' || files.length || _.trim(gif) !== '') {
      allowSend = true
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
          <div className={'composer-input-container'}>
          <textarea
            value={message}
            onChange={this.onChange}
            onKeyPress={(event) => {
              if (event.shiftKey === false && event.key === 'Enter') {

                event.preventDefault()
                this.send()
              }
            }}
            onBlur={() => {
              if (!message) {
                this.setState({
                  placeholder: true
                })
              }

            }}
            onFocus={(e) => {
              if (!message) {
                this.setState({
                  placeholder: false
                })
              }
              this.onClickInside(e)

            }} className={'composer-input'} placeholder={this.state.placeholder ? 'Type a message...' : ''}/>
          </div>
          <Tools className={'composer-tools'}>
            <Button
              onClick={() => {
                if (this.props.onOpenModal) {
                  this.props.onOpenModal('emoji')
                }
              }}
              title={'Emoji'} className={'emotion-tool'}>
              <i className={'md-icon'}>tag_faces</i>
            </Button>
            {
              !allowSend &&
              (<Fragment>
                <Button
                  onClick={() => {
                    if (this.props.onOpenModal) {
                      this.props.onOpenModal('gif')
                    }
                  }}
                  title={'GIF'} className={'gif-tool'}>
                  <i className={'md-icon'}>gif</i>
                </Button>
                <label className={'attachment-tools'} htmlFor={`attachment-input-${inputId}`}>
                  <i className={'md-icon'}>attachment</i>
                  <input id={`attachment-input-${inputId}`} onChange={this.onAddFiles} type={'file'} multiple={true}/>
                </label>
                <Button
                  onClick={() => {
                    if (this.props.onOpenModal) {
                      this.props.onOpenModal('options')
                    }
                  }}
                  title={'Add user'} className={'add-tool'}>
                  <i className={'md-icon'}>add_circle_outline</i>
                </Button>
              </Fragment>)
            }
            {allowSend && (<Button onClick={() => this.send()} className={'send'}>
              <i className={'md-icon'}>send</i>
            </Button>)}
          </Tools>
        </Inner>
      </Container>
    )
  }
}