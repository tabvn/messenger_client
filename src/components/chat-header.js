import React, { Fragment } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { api } from '../config'
import GroupAvatar from './group-avatar'

const Container = styled.div`
  height: 74px;
  background: ${props => props.active ? '#12416a' : '#637d94'};
  border-top-left-radius: ${props => props.dock ? '8px' : 0};
  border-top-right-radius: ${props => props.dock ? '8px' : 0};
  padding: 10px 20px;
  align-items: center;
  display: flex;
  flex-direction: row;
  &.not-dock{
    background: #12416a;
  }
  .ar-user-name{
    font-size: 21px;
    font-weight: 100;
    color: #FFF;
    text-align: left;
    a{
      color: #FFF;
      font-size: 21px;
      text-decoration: none;
    }
  }
  .chat-title{
    font-size: 28px;
    font-weight: 100;
    color: #FFF;
    text-overflow: ellipsis; 
    overflow: hidden; 
    white-space: nowrap;
    text-align: center;
    .user-status{
      text-align: left;
    }
  }
  .user-status{
    margin-top: 2px;
    font-size: 15px;
    color: #FFF;
    font-weight: 100;
    text-align: left;
    display: flex;
    align-items: center;
  }
  .header-chat-info-container{
    padding: 0 15px;
    flex-grow: 1;
    overflow: hidden;
  }
`

const ToggleButton = styled.button`
  border: 0 none;
  background: none;
  margin: 0;
  cursor:pointer;
  padding: 3px;
  outline: 0 none;
  &:active,&:focus{
    outline: 0 none;
  }
  i{
    color: #FFF;
  }
`

const Status = styled.div`
    text-align: left;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    bottom: 5px;
    border: 1px solid #FFF;
    &.offline{
          background: rgba(177, 187,192,1);
      }
    &.online {
        background: rgba(119, 183,103,1);
    }
    &.busy {
        background: rgba(244, 67,54,1);
    }
    &.away {
        background: rgba(247, 173,55,1);
    }
     
`

const UserStatus = styled.div`

    position: relative;
    width: 45px;
    height: 45px;
    min-width: 40px;
    min-height: 40px;
    background: ${props => props.noUser ? 'none' : '#0096e3'};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    i{
      color: #FFF;
    }
    img{
      width: 45px;
      height: 45px;
      max-width: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  
`

const HeaderChatInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction:row;
  .group-avatar{
    position: relative;
    width: 45px;
    height: 45px;
    min-width: 40px;
    min-height: 40px;
    background: #0096e3;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #e5e7e8;
    i{
      color: #FFF;
    }
    img{
      width: 45px;
      height: 45px;
      max-width: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }

`

const CloseButton = styled.button`
  cursor: pointer;
  border: 0 none;
  padding: 3px;
  margin: 0;
  outline:0 none;
  background: none;
  color: #FFF;
  &:focus,&:active{
    outline:0 none;
  }
`

const HeaderAvatar = styled.div`
  width: 55px;
  height: 45px;
  margin-right: 10px;
  position: relative;
`

const UnreadCount = styled.div`
  width: 17px;
  height: 17px;
  border-radius: 5px;
  background: #f8c231;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;  
  z-index: 2;
  span{
    display: block;
    font-size: 12px;
    color: #000;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;  
  }
`

const GroupMoreUser = styled.div`
  cursor: pointer;
  margin-top: 3px;
  border-radius: 5px;
  background: #335b7e;
  width: 90px;
  color: #FFF;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  i{
    color: #b0bdc9;
   }
   span {
    color: #FFF;
    font-size: 12px;
    display: block;
   }
`

const GroupBottomInfo = styled.div`
  display: flex;
  flex-direction: row;
`

const CallButton = styled.button`

  border: 0 none;
  background: none;
  padding: 0;
  marin: 0;
  outline: 0 none;
  margin-left: 5px;
  cursor: pointer;
  &:active,&:focus{
    outline: 0 none;
  }
  i{
    color: #FFF;
    font-size: 24px;
  }
`

export default class ChatHeader extends React.Component {

  getFileUrl = (avatar) => {
    return `${api}/group/avatar?name=${avatar}`
  }

  renderGroupAvatar = () => {
    const {avatar, users} = this.props
    return (
      !avatar ? <GroupAvatar users={users}/> : <div className={'group-avatar'}>
        <img src={this.getFileUrl(avatar)} alt={''}/>
      </div>
    )
  }
  renderUserAvatar = () => {

    const {users} = this.props

    const avatar = _.get(users, '[0].avatar', '')
    const status = _.get(users, '[0].status', 'offline')
    return (
      <UserStatus
        noUser={users.length === 0}
        className={'user-avatar'}>
        {
          users.length ? <Fragment>
            {avatar && avatar !== '' ? <img src={avatar} alt={''}/> : <i className={'md-icon md-24'}>person_outline</i>}
          </Fragment> : null
        }
        {users.length ? <Status className={`user-status ${status}`}/> : null}
      </UserStatus>
    )
  }

  renderChatTitle = () => {

    const {users} = this.props

    const firstUser = _.get(users, '[0]')
    const name = `${_.get(firstUser, 'first_name', '')} ${_.get(firstUser, 'last_name', '')}`

    return (
      <div className={'ar-user-name'}>
        <a href={`/member/${_.get(firstUser, 'uid')}`}>{name}</a>
        {users.length > 1 ? ',...' : null}
      </div>
    )
  }
  renderChatInfo = () => {

    const {title, users, unread, isNew} = this.props

    return (
      <HeaderChatInfo className={'chat-header-info'}>
        {!isNew && <HeaderAvatar className={'chat-header-avatar'}>
          {
            unread > 0 && (
              <UnreadCount className={'unread-count'}>
                <span>{unread}</span>
              </UnreadCount>
            )
          }
          {users.length > 1 ? this.renderGroupAvatar() : this.renderUserAvatar()}
        </HeaderAvatar>}

        {isNew ? <div style={{width: '100%'}} className={'chat-title'}>New Message</div> : <div
          className={'chat-title'}>
          {title ? title : this.renderChatTitle()}
          {users.length === 1 && <div
            className={'user-status'}>{_.upperFirst(_.get(users, '[0].status', 'offline'))} <CallButton
            onClick={() => {
              if (this.props.onVideoCall) {
                this.props.onVideoCall()
              }
            }}
            title={'Video call'}><i className={'md-icon'}>videocam</i></CallButton></div>}
          {
            users.length > 1 && (
              <GroupBottomInfo>
                <GroupMoreUser onClick={() => {
                  if (this.props.onOpenModal) {
                    this.props.onOpenModal('participants')
                  }
                }}>
                  <i className={'md-icon'}>group</i>
                  <span>+{users.length} more...</span>
                </GroupMoreUser>
                <CallButton
                  onClick={() => {
                    if (this.props.onVideoCall) {
                      this.props.onVideoCall()
                    }
                  }}
                  title={'Video call'}><i className={'md-icon'}>videocam</i></CallButton>
              </GroupBottomInfo>
            )
          }

        </div>}
      </HeaderChatInfo>
    )
  }

  render () {
    const {dock, open} = this.props
    let active = false

    if (this.props.active) {
      active = true
    }
    return (
      <Container active={active} dock={dock} className={`chat-header ${dock ? 'is-dock' : 'not-dock'}`}>
        {dock === true && <ToggleButton onClick={() => {
          if (this.props.onToggle) {
            this.props.onToggle()
          }
        }} className={'toggle-icon'}><i
          className={'md-icon'}>{open ? 'photo_size_select_small' : 'open_in_new'}</i></ToggleButton>}
        <div
          onClick={(e) => {
            if (this.props.onClick) {
              this.props.onClick(e)
            }
          }}
          className={'header-chat-info-container'}>
          {
            this.renderChatInfo()
          }
        </div>
        {
          dock ? (
            <CloseButton onClick={() => {
              if (this.props.onClose) {
                this.props.onClose()
              }
            }}>
              <i className={'md-icon'}>close</i>
            </CloseButton>
          ) : null
        }
      </Container>
    )
  }
}