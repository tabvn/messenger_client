import React from 'react'
import styled from 'styled-components'

import MessageUserAvatar from './message-user-avatar'


const Container = styled.div`
  height: min-content;
  padding: 10px 20px 10px 10px;
  &:first-child{
    padding-top: 30px;
  }
  .m-inner{
    display:flex;
    flex-direction: row;
    opacity: ${props => props.opacity};
    position: relative;
  }
  
`

const Text = styled.div `
  display: flex;
  flex-direction: row;
  align-items: center;
  .ar-w-circle{
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #cacaca;
    margin-left: 5px;
    
  }
`
export default class UserTyping extends React.Component{

  render(){

    const {user} = this.props

    return <Container
      opacity={1}
      className={'ar-is-tying'}>
      <div className={'m-inner'}>
        <MessageUserAvatar size={25} user={user}/>
        <Text>
          <div className={'ar-w-circle'}/>
          <div className={'ar-w-circle'}/>
          <div className={'ar-w-circle'}/>
        </Text>
      </div>


    </Container>
  }
}