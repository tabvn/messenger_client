import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`
  background: #ffffff;
  flex-grow: 1;
  .inner{
    height: content-height;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 450px;
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
    width: 40px;
    height: 40px;
    background: #2397e8;
    color: #FFF;
    border-radius: 50%;
    img{
      width: 40px;
      height: 40px;
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
    font-size: 16px;
    font-weight: 400;
      
  }
`
const AddFriend = styled.button`
  border: 0 none;
  border-radius: 3px;
  padding: 3px 10px;
  background: #f8c231;
  i{
    color: #FFF;
    font-size: 24px;
  }
  &.is-friend{
    background: #00a4f9;
  }
  &.add-f{
    cursor: pointer;
  }
`

export default class FriendSearchResult extends React.Component {

  render () {

    const {users, friends} = this.props

    return (
      <Container className={'search-user-result'}>
        <div className={'inner'}>
          {users.map((user, index) => {
            const avatar = _.get(user, 'avatar', null)
            const name = `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`

            const isFriend = friends.find((f) => f.id === user.id)

            return (
              <User
                onClick={() => {
                  if (this.props.onSelect) {
                    this.props.onSelect(user)
                  }

                }}
                key={index} className={'user-result'}>
                <div className={'search-user-avatar'}>
                  {avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon'}>person_outline</i>}
                </div>
                <div className={'search-user-name'}>{name}</div>
                <AddFriend
                  onClick={() => {
                    if (!isFriend && this.props.onAddFriend) {
                      this.props.onAddFriend(user)
                    }
                  }}
                  className={isFriend ? 'is-friend' : 'add-f'}>
                  <i className={'md-icon'}>{isFriend ? 'access_time' : 'person_add'}</i>
                </AddFriend>
              </User>
            )
          })}
        </div>
      </Container>)

  }
}