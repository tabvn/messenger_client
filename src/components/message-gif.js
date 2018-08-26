import React from 'react'
import styled from 'styled-components'
import Menu from './menu'

const Container = styled.div`
  display: flex;
  justify-items: center;
  align-items: center;
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

    const {sent} = this.props
    const action = {title: 'Delete', icon: 'delete', action: 'delete'}

    return (
      <Container className={'message-gif'}>
        <img src={this.getUrl()} alt={''}/>
        {sent && <Menu onClick={() => {
          if (this.props.onDelete) {
            this.props.onDelete(action)
          }
        }} items={[action]}/> }
      </Container>
    )
  }
}