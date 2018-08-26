import React from 'react'
import styled from 'styled-components'
import Message from './message'

const Container = styled.div`
  flex-grow: 1;
  .inner{
    display: flex;
    flex-direction:column;
    overflow-y: auto;
    overflow-x: hidden;
    height: ${props => props.h}px;
  }
  .no-message{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .no-message-icons{
      display: flex;
      flex-direction: row;
      justify-content: center;
      i{
        color: #c4c4c4;
        font-size: 36px;
      }
    }
  }
  .no-message-help{
    color: #b0bdc9;
    font-size: 21px;
  }
`

export default class Messages extends React.Component {

  scrollToBottom = () => {
    if (this.ref) {
      this.ref.scrollTop = this.ref.scrollHeight
    }
  }

  componentDidMount () {
    this.scrollToBottom()

  }

  componentDidUpdate (prevProps) {
    if (this.props.messages.length > prevProps.messages.length) {
      this.scrollToBottom()
    }
  }

  renderMessages = () => {

    const {messages, dock} = this.props

    let author = null

    let rows = []

    messages.map((message, index) => {

      rows.push(<Message onEdit={(message) => {
        if (this.props.onEdit) {
          this.props.onEdit(message)
        }
        
      }} dock={dock} hideAvatar={author === message.user_id} key={index} message={message}/>)

      author = message.user_id

      return message
    })

    return rows
  }

  renderEmpty = () => {

    return (
      <div className={'no-message'}>

        <div className={'no-message-icons'}>
          <i className={'md-icon'}>tag_faces</i>
          <i className={'md-icon'}>tag_faces</i>
        </div>
        <div className={'no-message-help'}>
          start your conversation here
        </div>
      </div>
    )
  }

  render () {

    const {messages, hasFile, height} = this.props

    let h = height

    if (hasFile) {
      h = h - 44
    }
    return (
      <Container
        h={h}
        onClick={(e) => {
          if (this.props.onClick) {
            this.props.onClick(e)
          }
        }}
        className={'ar-messages'}>
        <div ref={(ref) => this.ref = ref} className={'inner'}>
          {
            messages.length ? this.renderMessages() : this.renderEmpty()
          }
        </div>

      </Container>
    )
  }
}