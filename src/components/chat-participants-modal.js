import React from 'react'
import styled from 'styled-components'
import CreateGroupHeader from './create-group-header'
import ParticipantsList from './participants-list'
import UserList from './user-list'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  addUserToChat,
  addUserToGroup,
  closeChat,
  leaveGroupChat,
  removeUserFromChat,
  removeUserFromGroup,
  updateGroup
} from '../redux/actions'
import _ from 'lodash'

const Container = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
`

const Close = styled.div`
  cursor: pointer;
  border: 0 none;
  outline: 0 none;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 10px;
  top: 10px;
  color: #adadad;
  i{
    color: #adadad;
  }
`

const Inner = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  .participants-header{
    padding: 20px 10px 5px 10px;
  }

`

const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px;
`

const Tab = styled.button`
  background: ${props => props.active ? '#f8c231' : '#7f7f7f'};
  color:  ${props => props.active ? '#484848' : '#FFF'};
  font-size: 20px;
  padding: 7px 10px;
  text-align: center;
  flex-grow: 1;
  border: 0 none;
  margin: 0;
  outline: 0 none;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  &:hover,&:active, &:focus{
    outline: 0 none;
  }
  
`

const TabContent = styled.div`
  flex-grow: 1;
  padding: 10px;
`

const LeaveGroup = styled.button`
  width: 170px;
  cursor: pointer;
  color: #7f7f7f;
  font-size: 20px;
  border: 0 none;
  outline: 0 none;
  padding: 5px 10px 10px 10px;
  background: transparent;
  text-align: left;
  display: flex;
  &:active,&:focus,&:hover{
    outline: 0 none;
  
  }
  &:hover{
    opacity: 0.7;
  }
  i{
    color: #7f7f7f;
    margin-right: 5px;
  }
 
`

class ChatParticipantsModal extends React.Component {

  state = {
    activeTab: 0,
  }

  handleSelectUser = (user) => {
    const {group, tab} = this.props
    const {users} = this.props

    const isSelected = users.find((i) => i.id === user.id)
    if (!isSelected) {

      const tabId = _.get(tab, 'id')
      if (tabId) {
        // remove user from chat window
        this.props.addUserToChat(tabId, user)
      }

      const groupId = _.get(group, 'id')
      if (groupId) {
        this.props.addUserToGroup(groupId, user, true)
      }

    }
  }
  handleRemoveUser = (user) => {

    const {group, tab} = this.props
    const tabId = _.get(tab, 'id')

    if (tabId) {
      // remove user from chat window
      this.props.removeUserFromChat(tabId, user)
    }

    const groupId = _.get(group, 'id')
    if (groupId) {
      this.props.removeUserFromGroup(groupId, user, true)
    }

  }
  handleLeaveChat = () => {
    const {group, tab} = this.props

    const tabId = _.get(tab, 'id')

    if (tabId) {
      this.props.closeChat(tabId)
    }

    const groupId = _.get(group, 'id')

    if (groupId) {
      this.props.leaveGroupChat(groupId)
    }
  }

  render () {
    const {activeTab} = this.state
    const {users, dock, height} = this.props

    let group = this.props.group

    let h = height - 400
    if (dock) {
      h = 240
    }

    if (users.length < 2) {
      h += 100;
    }
    return (
      <Container className={'participants'}>
        <Close onClick={() => {
          if (this.props.onClose) {
            this.props.onClose()
          }
        }} className={'close-modal'}><i className={'md-icon'}>close</i></Close>
        <Inner className={'participants-inner'}>
          <div className={'participants-header'}>
            {users.length > 1 && <CreateGroupHeader
              dock={dock}
              placeholder={'Add a name to this chat'}
              group={group}
              onChange={(info) => {
                group.title = info.name
                group.avatar = info.avatar
                this.props.updateGroup(group.id, group, true)

              }}/>}
          </div>
          <Tabs className={'participants-tabs'}>
            <Tab
              onClick={() => {
                if (activeTab !== 0) {
                  this.setState({
                    activeTab: 0
                  })
                }
              }}
              active={activeTab === 0} className={'tab-participant'}>
              Participants
            </Tab>
            <Tab
              onClick={() => {
                if (activeTab !== 1) {
                  this.setState({
                    activeTab: 1
                  })
                }
              }}
              active={activeTab === 1} className={'tab-add-friend'}>
              Add Friends
            </Tab>
          </Tabs>
          <TabContent className={'tab-content'}>
            {
              activeTab === 0 ? (
                <ParticipantsList
                  dock={dock}
                  height={h}
                  onRemoveUser={this.handleRemoveUser}
                  users={users}/>
              ) : <UserList
                height={`${h - 70}px`}
                onSelect={this.handleSelectUser}
                selected={users}
                placeholder={'Search people to add...'}/>
            }
          </TabContent>
          {users.length > 1 &&
          <LeaveGroup onClick={this.handleLeaveChat}><i className={'md-icon'}>directions_run</i> leave
            group</LeaveGroup>}

        </Inner>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  closeChat,
  leaveGroupChat,
  removeUserFromChat,
  removeUserFromGroup,
  addUserToGroup,
  addUserToChat,
  updateGroup
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChatParticipantsModal)