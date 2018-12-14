import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`
  background: #ffffff;
  border-bottom-left-radius: 5px;
  border-radius: 5px;
  box-shadow: 0 1px 1px 0 #b0b0b0;
  .inner{
    height: content-height;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 250px;
  }
`

const User = styled.div`
  padding: 5px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover{
    background: #efefef;
  }
  .search-user-avatar{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 29px;
    height: 29px;
    background: #2397e8;
    color: #FFF;
    border-radius: 50%;
    img{
      width: 29px;
      height: 29px;
      max-width: 100%;
      border-radius: 50%;
    }
    i{
      color: #FFF;
    }
  }
  .search-user-name{
    padding-left: 5px;
    text-align: left;
    flex-grow: 1;
    color: #484848;
    font-size: 13px;
    font-weight: 400;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 113px;
      
  }
`

const Actions = styled.div`
  button {
    border-radius: 5px;
    border: 0 none;
    padding: 3px 5px;
    margin: 0;
    i{
      font-size: 18px;
    }
    &:hover,&:active{
      outline: 0 none;
    }
    &.ar-open-conversation{
      margin-left: 5px;
    }
  }
`

const RequestSent = styled.button`
  background: #00a4f9;
  color: #FFF;
  
`

const InviteButton = styled.button`
  background: #f8c231;
  color: #FFF;
  cursor: pointer;

`

const MessageButton = styled.button`
  background: #b0b0b0;
  color: #FFF;
  cursor: pointer;
  margin-left: 5px;
`

export default class SearchUserResult extends React.Component {

  render () {

    let {users} = this.props

    return (
      <Container className={'search-user-result'}>
        <div className={'inner'}>
          {users.map((user, index) => {
            const avatar = _.get(user, 'avatar', null)
            const name = `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`

            let requestSent = _.get(user, 'friend_request_sent', false)

            return (
              <User
                key={index} className={'user-result'}>
                <div onClick={() => {
                  if (this.props.onSelect) {
                    this.props.onSelect(user)
                  }

                }} className={'search-user-avatar'}>
                  {avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon'}>person_outline</i>}
                </div>
                <div onClick={() => {
                  if (this.props.onSelect) {
                    this.props.onSelect(user)
                  }

                }} className={'search-user-name'}>{name}</div>
                <Actions className={'add-friend-actions'}>
                  {requestSent && <RequestSent className={'ar-friend-request-sent'}><i
                    className={'md-icon'}>access_time</i></RequestSent>}
                  {!requestSent && <InviteButton className={'ar-friend-add'} onClick={() => {
                    if (this.props.onRequestAddFriend) {
                      this.props.onRequestAddFriend(user)
                    }
                  }}><i className={'md-icon'}>person_add</i></InviteButton>}
                  <MessageButton
                    onClick={() => {
                      if (this.props.onSelect) {
                        this.props.onSelect(user)
                      }
                    }}
                    className={'ar-open-conversation'}><i className={'md-icon'}>edit</i></MessageButton>
                </Actions>
              </User>
            )
          })}
        </div>
      </Container>)

  }
}