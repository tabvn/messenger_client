import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  img{
    max-width: 100%;
    max-height: 260px;
    border-radius: 8px;
  }
`

export default class MessageGif extends React.Component {

  getUrl = () => {
    const {gif} = this.props

    return `https://media0.giphy.com/media/${gif}/giphy.gif`
  }

  render () {

    return (
      <Container className={'message-gif'}>
        <img src={this.getUrl()} alt={''}/>
      </Container>
    )
  }
}