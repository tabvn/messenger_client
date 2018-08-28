import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getGroupUsers, getLastMessage, groupIsActive } from '../redux/selector/group'
import ConversationAvatar from './conversation-avatar'
import ConversationTitle from './conversation-title'

const Container = styled.div`
  min-height: 50px;
  position: relative;
  cursor: pointer;
  &:hover{
    background: #ebebeb;
    .close-conversation{
      visibility: visible;
    }
  }
  .inner{
    padding: 10px;
    display: flex;
    flex-direction: row;
    ${props => !props.sidebarIsOpen ? 'justify-content: center;' : null}
    background: ${props => props.bg};
  }
  
  
`

const Button = styled.button`
  width: 25px;
  height: 25px;
  background: #FFF;
  border-radius: 50%;
  padding: 0;
  border: 0 none;
  position: absolute;
  right: 10px;
  top: 5px;
  cursor: pointer;
  color: #cacaca;
  display: flex;
  visibility: hidden;
  justify-content: center;
  i{
    color: #cacaca;
  }
  
`

class Conversation extends React.Component {

  render () {

    const {users, group, lastMessage, sidebarIsOpen, active, dock} = this.props

    let background = "none"
    if(active && !dock){
      background = "#FFF"
    }
    if(active && dock){
      background = "#ebebeb"
    }

    return (
      <Container
        bg={background}
        active={active}
        sidebarIsOpen={sidebarIsOpen} className={'conversation'}>
        <div onClick={() => {
          if (this.props.onSelect) {
            this.props.onSelect(group, users)
          }
        }} className={'inner'}>
          <ConversationAvatar avatar={group.avatar} unread={_.get(group, 'unread', 0)} users={users}/>
          {sidebarIsOpen && (
            <ConversationTitle message={lastMessage} title={_.get(group, 'title', '')} users={users}/>
          )}
        </div>
        {sidebarIsOpen && (
          <Button onClick={() => {
            if (this.props.onClose) {
              this.props.onClose(group)
            }
          }} className={'close-conversation'}>
            <i className={'md-icon md-16'}>close</i>
          </Button>
        )}
      </Container>
    )
  }
}

const mapStateToProps = (state, props) => ({
  users: getGroupUsers(state, props),
  lastMessage: getLastMessage(state, props),
  sidebarIsOpen: state.sidebar.open,
  active: groupIsActive(state, _.get(props, 'group.id'), props.dock),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)