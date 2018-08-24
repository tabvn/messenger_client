import React, { Fragment } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { api } from '../config'

const Container = styled.div`
  position: relative;
  height: 40px;
  padding-left: 8px;
  .group-avatar{
    width: 40px;
    height: 40px;
    background: #009beb;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    i{
      color: #FFF;
    }
  }
  .user-avatar, .group-avatar{
    width: 40px;
    height: 40px;
    background: #0096e3;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    i{
      color: #FFF;
    }
    img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
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
  span{
    display: block;
    font-size: 12px;
    color: #000;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;  
  }
`

const UserStatus = styled.div`
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
export default class ConversationAvatar extends React.Component {

  getFileUrl = (avatar) => {
    return `${api}/group/avatar?name=${avatar}`
  }

  renderGroupAvatar () {
    const {avatar} = this.props

    return (
      <div className={'group-avatar'}>
        {!avatar ? <i className={'md-icon md-24'}>group</i> : <img src={this.getFileUrl(avatar)} alt={''}/>}
      </div>
    )
  }

  renderUserAvatar () {
    const {users} = this.props

    const user = _.get(users, '[0]', null)

    const avatar = _.get(user, 'avatar', null)
    const status = _.get(user, 'status')

    return (
      <Fragment>
        <div className={'user-avatar'}>
          {
            avatar && avatar !== '' ? <img src={avatar} alt={''}/> : <i className={'md-icon md-24'}>person_outline</i>
          }
        </div>
        <UserStatus
          className={`user-status ${_.toLower(status)}`}/>
      </Fragment>
    )
  }

  render () {
    const {users, unread} = this.props

    return (

      <Container className={'conversation-avatar'}>
        {
          users.length > 1 ? this.renderGroupAvatar() : this.renderUserAvatar()
        }
        {unread > 0 && <UnreadCount className={'unread-count'}><span>{unread}</span></UnreadCount>}
      </Container>
    )
  }
}