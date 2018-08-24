import React from 'react'
import styled from 'styled-components'
import Conversation from './conversation'

const Container = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  height: ${props => props.h}px;
  .conversation-not-found{
      padding: 10px;
      text-align: center;
  }
  
  .not-found-icon{
    margin-top: 50px;
    margin-bottom: 10px;
    i{
      padding: 3px 5px;
      background: #c4c4c4;
      color: #FFF;
      border-radius: 3px;
    }
    
  }
  .not-found-message{
    font-size: 24px;
    color: #c4c4c4;
    font-weight: 400;
    text-align: center;
  }
  .helper-message{
    margin-top: 10px;
    font-size: 14px;
    color: #c4c4c4;
    font-weight: 400;
   
    span{
      color: #f8c231;
      cursor: pointer;
    }
  }
  
  .search-no-result{
    padding: 10px;
    
  }
  .no-result-message{
    margin-top: 50px;
    font-size: 15px;
    font-weight: 700;
    color: #7f7f7f;
  }
  .no-result-helper-message{
    margin-top: 10px;
    font-size: 15px;
    font-weight: 400;
    color: #7f7f7f;
    ul,li{
      padding: 0;
      margin: 0;
      list-style: none;
      list-style-image: none;
    }
    ul{
      margin-top: 10px;
    }
    li{
      padding: 3px 0;
      font-size: 15px;
      color: #7f7f7f;
    }
  }
`

export default class Conversations extends React.Component {

  renderConversations = () => {

    const {groups, dock} = this.props

    return (
      groups.map((group, index) => {
        return (
          <Conversation
            dock={dock}
            onSelect={(group, users) => {

              if (this.props.onSelect) {
                this.props.onSelect(group, users)
              }
            }}
            onClose={(g) => {

              if (this.props.onClose) {
                this.props.onClose(g)
              }
            }} group={group} key={index}/>
        )
      })
    )

  }
  renderSearchNoResult = () => {

    return (
      <div className={'search-no-result'}>
        <div className={'no-result-message'}>
          No results found.
        </div>
        <div className={'no-result-helper-message'}>
          Useful tips:
          <ul>
            <li>● Try using shorter keywords</li>
            <li>● Make sure all words are written properly</li>
          </ul>
        </div>
      </div>
    )
  }

  renderNotFound = () => {

    const {searchIsDone, search,sidebarIsOpen} = this.props

    if (searchIsDone && search !== '') {
      return this.renderSearchNoResult()
    }

    return (
      sidebarIsOpen ? <div className={'conversation-not-found'}>
        <div className={'not-found-icon'}>
          <i className={'md-icon'}>priority_high</i>
        </div>
        <div className={'not-found-message'}>
          you don’t have any messages yet
        </div>
        <div className={'helper-message'}>
          get started by clicking <br/>
          <span onClick={() => {
            if (this.props.onCreateConversation) {
              this.props.onCreateConversation()
            }
          }}>create message</span> at the top
        </div>
      </div> : null
    )
  }

  render () {

    const {groups, appIsFetched, height,sidebarIsOpen} = this.props

    let h = height - 260
    if(sidebarIsOpen){
      h = height - 140
    }

    return (
      <Container
        h={h}
        className={'conversations'}>
        {
          appIsFetched && groups.length === 0 ? this.renderNotFound() : this.renderConversations()
        }
      </Container>
    )
  }
}