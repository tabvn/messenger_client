import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 10px 20px 10px 10px;
  .message-type-notification-body{
      color: #c4c4c4;
      text-align: center;
      margin-left: 50px;
  }
`

export default class NotificationMessage extends React.Component {

  render() {
    const {message} = this.props
    return (
        <Container className={'message-type-notification'}>
          <div className={'message-type-notification-body'}>{message.body}</div>
        </Container>
    )
  }
}