import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: min-content;
  padding: 10px 20px 10px 10px;
  display: flex;
  justify-content: center;
  .message-text{
    color: #c4c4c4;
    text-align: center;
  }

`

export default class BottomNotification extends React.Component {

  render() {
    const {message} = this.props
    return (
        <Container className={'bottom-notification'}>
          <div className={'message-text'}>{message}</div>
        </Container>
    )
  }

}