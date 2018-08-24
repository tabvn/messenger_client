import React, { Fragment } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { toggleFriendGroup, unblockFriend } from '../redux/actions'
import SearchUser from './search-user'

const Container = styled.div`

  overflow-x: hidden;
  overflow-y: auto;
  height: ${props => props.h}px;
  .friend-not-found{
    padding: 10px;
  }
  .person-icons{
    margin-top: 50px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    
  }
  .person-icon{
    margin: 0 3px;
    background: #c4c4c4;
    padding: 3px 5px;
    border-radius: 5px;
    i{
      color: #FFF;
      font-size: 30px;
    }
  }
  .not-found-message{
    font-size: 24px;
    font-weight: 300;
    color: #c4c4c4;
    text-align: center;
  }
  .no-friend-message{
    color: #c4c4c4;
    font-size: 24px;
    span{
      display: block;
      font-size: 12px;
      color: #c4c4c4;
      font-weight: 700;
      margin-top: 10px;
    }
  }
  .search-user-container{
    margin-top: 20px;
  }

`

const Heading = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  .heading-title{
    flex-grow: 1;
    font-size: 12px;
    font-weight: 300;
    color: #b0b0b0;
    text-transform: uppercase;
  }
  &:hover{
    background: #efefef;
  }

`

const OpenButton = styled.button`
  cursor: pointer;
  border: 0 none;
  outline: 0 none;
  padding: 3px;
  background: none;
  &:focus,&:active{
    outline: 0 none;
  }
  i{
    color: #b0b0b0;
    font-size: 18px;
  }
`

const User = styled.div`
  position: relative;
  &:hover{
    background: #efefef;
  }
  .friend-inner{
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    
  }
  .friend-avatar{
    position: relative;
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
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
      max-width: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .friend-name{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 5px;
    flex-grow: 1;
    font-size: 15px;
    font-weight: 300;
    color: #484848;
  }
    
`

const Status = styled.div`
    width: 8px;
    height: 8px;
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

const Button = styled.button`
  position: absolute;
  top: 15px;
  right: 10px;
  background: #7f7f7f;
  font-size: 9px;
  color: #FFF;
  padding: 8px;
  border: 0 none;
  outline: 0 none;
  border-radius: 5px;
  cursor: pointer;
  &:focus,&:active{
    outline: 0 none;
  }
`

class Friends extends React.Component {

  renderUser = (user) => {

    const avatar = _.get(user, 'avatar', null)
    const firstName = _.get(user, 'first_name', '')
    const lastName = _.get(user, 'last_name', '')
    const status = _.get(user, 'status', 'offline')
    const blocked = _.get(user, 'blocked', false)
    return (
      <User className={'friend'}>
        <div onClick={() => {

          if (this.props.onSelect) {
            this.props.onSelect(user)
          }

        }} className={'friend-inner'}>
          <div className={'friend-avatar'}>
            {avatar && avatar !== '' ? <img src={avatar} alt={''}/> : <i className={'md-icon md-24'}>person_outline</i>}
            <Status className={`friend-status ${status}`}/>
          </div>
          <div className={'friend-name'}>{`${firstName} ${lastName}`}</div>
        </div>
        {blocked && <Button onClick={() => {
          this.props.unblockFriend(user)

        }} className={'unblock-friend'}>Unblock</Button>}
      </User>
    )
  }

  renderGroup = (key = '', title = '', users = [], open = true) => {
    return (
      <Fragment>
        <Heading
          onClick={() => {
            this.props.toggleFriendGroup(key, !open)
          }}
          className={'contact-group-heading'}>
          <div className={'heading-title'}>{title}</div>
          <OpenButton className={'open-close-friend-group'}><i
            className={'md-icon'}>{open ? 'remove' : 'add'}</i></OpenButton>
        </Heading>
        {open && users.map((user, index) => {

          return (
            <Fragment key={index}>
              {this.renderUser(user)}
            </Fragment>
          )
        })
        }
      </Fragment>
    )
  }

  renderFriends = () => {

    const {users, open} = this.props

    const online = users.filter((u) => u.status !== 'offline' && u.blocked === false)
    const offline = users.filter((u) => u.status === 'offline' && u.blocked === false)
    const blocked = users.filter((u) => u.blocked === true)

    let items = [
      {key: 'online', title: 'Online users', users: online, open: _.get(open, 'online', true)},
      {key: 'offline', title: 'Offline users', users: offline, open: _.get(open, 'offline', true)},
      {key: 'blocked', title: 'Blocked users', users: blocked, open: _.get(open, 'blocked', true)},
    ]

    return items.map((g, index) => {
      return (
        <Fragment key={index}>
          {
            g.users.length ? this.renderGroup(g.key, g.title, g.users, g.open) : null
          }
        </Fragment>
      )
    })
  }

  renderSearchUser = () => {
    return (
      <div className={'no-friend-container'}>
        <div className={'no-friend-message'}>you don’t have any friends yet<br/><span>try using friends search:</span>
        </div>
        <div className={'search-user-container'}>
          <SearchUser onSelect={(user) => {
            if (this.props.onSelect) {
              this.props.onSelect(user)
            }
          }}/>
        </div>

      </div>

    )
  }
  renderNotFound = () => {

    const {searchIsDone, search} = this.props

    return (
      <div className={'friend-not-found'}>
        <div className={'person-icons'}>
          <div className={'person-icon'}><i className={'md-icon'}>person</i></div>
          <div className={'person-icon'}><i className={'md-icon'}>person_outline</i></div>
        </div>
        <div
          className={'not-found-message'}>{search !== '' && searchIsDone ? 'Result not found' : this.renderSearchUser()}</div>
      </div>
    )
  }

  render () {
    const {appIsFetched, users, height, sidebarIsOpen} = this.props

    let h = height - 250
    if(sidebarIsOpen){
      h = height - 140
    }


    return (
      <Container
        h={h}
        className={'friends'}>
        {appIsFetched && users.length === 0 ? this.renderNotFound() : this.renderFriends()}
      </Container>)
  }
}

const mapStateToProps = (state) => ({
  open: state.friendGroupOpen,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleFriendGroup,
  unblockFriend
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Friends)