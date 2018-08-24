import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { searchUsers, openChat, updateChat, closeChat, openInboxChat } from '../redux/actions'

const Container = styled.div`
   display: flex;
   flex-grow: 1;
   flex-direction: column;
   display: ${props => props.hide ? 'none' : 'flex'};
   background: #FFF;
`

const Header = styled.div`
  background: #efefef;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px;
  .label{
    color: #484848;
    font-size: 20px;
    padding: 0 10px;
  }
  input{
    background: none;
    border: 0 none;
    padding: 5px 10px;
    flex-grow: 1;
    color: #484848;
    font-size: 20px;
    font-weight: 300;
  }
`

const User = styled.div`
  cursor: pointer;
  padding: 15px 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover{
    background: #12416a;
    .search-user-name{
      color: #FFF;
    }
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
    font-size: 20px;
    font-weight: 400;
      
  }
`

const NoResult = styled.div`
  background: #FFF;
  height: ${props => props.h};
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
  .no-result-icons{
    color: #c4c4c4;
    display: flex;
    i{
      color: #c4c4c4;
      margin: 10px 5px;
      font-size: 40px;
    }
  }
  .no-result-heading{
    color: #c4c4c4;
    font-size: 30px;
    span{
      color: #c4c4c4;
      font-size: 18px;
      display: block;
    }
  }

`

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: ${props => props.h};
  .msg{
    color: #c4c4c4;
    font-size: 30px;
    text-align: center;
  }
  .person-icons{
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
  

`

const Inner = styled.div`
    background: #ffffff;
    height: min-content;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: ${props => props.height};
    min-height: ${props => props.height};
   
    
`

const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${props => props.h};
  .welcome-icons{
    i{
      color: #c4c4c4;
      font-size: 40px;
      margin: 3px;
    }
  }
  .welcome-message{
    color: #c4c4c4
    font-size: 24px;
    text-align: center;
  }

`

class CreateSingleChat extends React.Component {

  constructor (props) {

    super(props)
    this.onSearch = _.debounce(this.search, 300)

  }

  state = {
    welcome: true,
    noResult: false,
    result: [],
    search: '',
    limit: 50,
    skip: 0,
  }

  clearSearch = () => {

    this.setState({
      search: '',
      result: [],
      noResult: false
    })
  }

  onChange = (e) => {

    const v = e.target.value
    this.setState({
      welcome: false,
      search: v,
      noResult: false,
    }, () => {
      this.onSearch(v)
    })

  }
  search = (value) => {
    const {currentUserId} = this.props
    const {limit, skip} = this.state
    if (!value) {
      this.setState({
        noResult: false,
        result: []
      })
      return
    }
    this.props.searchUsers(value, limit, skip).then((users) => {
      users = users.filter((u) => u.id !== currentUserId)
      this.setState({
        result: users,
        noResult: !users.length
      })

    }).catch((e) => {
      this.setState({
        result: [],
        noResult: true
      })

    })
  }
  onSelect = (user) => {
    const {tab, dock} = this.props
    // handle process create new conversation

    if (!dock) {
      // this is inbox
      this.props.openInboxChat([user], null, false)

    } else {
      if (tab) {
        tab.group.users = [user]
        tab.isNew = false
        // update chat tab
        if (this.props.tabs.length) {

          this.props.closeChat(tab.id)

          this.props.openChat([user])

        } else {
          this.props.updateChat(tab)
        }

      }
    }

  }

  renderEmptyMessage = () => {

    const {height} = this.props

    return (
      <Empty
        h={height}
        className={'no-friends'}>
        <div className={'person-icons'}>
          <div className={'person-icon'}><i className={'md-icon'}>person</i></div>
          <div className={'person-icon'}><i className={'md-icon'}>person_outline</i></div>
        </div>
        <div className={'msg'}>
          you don’t have any <br/>friends yet
        </div>
      </Empty>
    )
  }

  render () {
    let {search, result, noResult} = this.state
    const {currentUserId, height, hide} = this.props

    let users = this.props.users

    search = _.trim(search)

    if (search !== '') {
      users = result
    }

    users = users.filter((i) => i.id !== currentUserId && i.blocked === false)

    return (
      <Container
        hide={hide}
        className={'create-single-chat'}>
        <Header className={'single-chat-header'}>
          <div className={'label'}>To:</div>
          <input placeholder={'Add people...'} value={this.state.value} onChange={this.onChange}/>
        </Header>
        <Inner
          height={height}
          className={'result-inner'}>
          {
            !search && !users.length && !this.state.welcome ? this.renderEmptyMessage() : null
          }
          {
            this.state.welcome ? (
              <Welcome
                h={height}
                className={'welcome-message'}>
                <div className={'welcome-icons'}>
                  <i className={'md-icon'}>tag_faces</i>
                  <i className={'md-icon'}>mood</i>
                </div>
                <div className={'welcome-message'}>
                  add people and start<br/>
                  your conversation here
                </div>
              </Welcome>
            ) : null
          }
          {noResult ?
            <NoResult
              h={height}
              className={'no-result'}>
              <div className={'no-result-icons'}>
                <i className={'md-icon'}>mood_bad</i>
                <i className={'md-icon'}>sentiment_dissatisfied</i>
              </div>
              <div className={'no-result-heading'}>
                no results found
                <span>try entering a different name</span>
              </div>
            </NoResult> : null}
          {
            !noResult && !this.state.welcome && (
              <div className={'user-result'}>
                {users.map((user, index) => {
                  const avatar = _.get(user, 'avatar', null)
                  const name = `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`

                  return (
                    <User
                      onClick={() => {
                        this.onSelect(user)
                      }}

                      key={index} className={'user-result'}>
                      <div className={'search-user-avatar'}>
                        {avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon'}>person_outline</i>}
                      </div>
                      <div className={'search-user-name'}>{name}</div>

                    </User>
                  )
                })}
              </div>
            )

          }
        </Inner>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.user,
  currentUserId: _.get(state.app.user, 'id', null),
  tabs: state.chat.tabs,
  inbox: state.inbox.active,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchUsers,
  openChat,
  closeChat,
  updateChat,
  openInboxChat
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CreateSingleChat)