import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { searchUsers, setUser, requestAddFriend } from '../redux/actions'
import { connect } from 'react-redux'
import FriendSearchResult from './friend-search-result'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .search-input-container{
    background: #f8f8f8;
    display: flex;
    flex-direction:row;
    padding: 0 10px;
    border-radius: 5px;
    input{
      min-width: 50px;
      font-size: 15px;
      font-style: italic;
      color: #b0b0b0;
      min-height:40px; 
      border: 0 none;
      background: transparent;
      padding: 8px 0;
      flex-grow: 1;
      width: 100%;
    }
  }
  
`
const Content = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  
`

const Back = styled.button`
  font-size: 15px;
  color: #484848;
  font-weight: 700;
  display: flex;
  flex-direction: row;
  border: 0 none;
  background: none;
  cursor: pointer;
  
`

const Button = styled.button`
  cursor: pointer;
  border: 0 none;
  padding: 0;
  background: none;
  outline: 0 none;
  &:active,&:focus{
    outline: 0 none;
  }
  i{
    color: #4d4d4d;
    font-size: 20px;
  }
`

const Results = styled.div`
  flex-grow: 1;
  display: flex;
  .first-message{
      flex-direction: column;
      color: #b0b0b0;
      font-size: 20px;
      display: flex;
      flex-row: 1;
      justify-content: center;
      width: 100%;
      align-items: center;
      span{
        color: #b0b0b0;
      }
      strong{
        font-weight: 700;
      }
  }
  .not-found-message{
      flex-direction: column;
      color: #b0b0b0;
      font-size: 20px;
      display: flex;
      flex-row: 1;
      justify-content: center;
      width: 100%;
      strong{
        font-weight: 700;
      }
  }
  .tips{
    color: #7f7f7f;
    font-size: 18px;
    padding-top: 10px;
    ul{
      margin: 10px 0 0 0;
      list-style: disc;
      list-style-image: none;
      li{
        list-style: disc;
        list-style-image: none;
        background: none;
        background-image: none;
        color: #7f7f7f;
        font-size: 18px;
      }
    }
  }
`

class FriendSearch extends React.Component {

  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
    this.search = this.search.bind(this)
    this.onSearch = _.debounce(this.search, 300)

    this.state = {
      noResult: false,
      value: '',
      users: [],
      limit: 50,
      skip: 0,
    }

  }

  onChange = (e) => {

    const value = e.target.value
    this.setState({
      value: value,
      users: [],
    }, () => {
      this.onSearch(value)
    })

  }

  clearSearch = () => {
    this.setState({
      value: '',
      users: [],
    })
  }

  search = (value) => {
    if (_.trim(value) === '') {
      this.setState({
        users: [],
        noResult: false,
      })

      return
    }
    const {currentUserId} = this.props
    const {limit, skip} = this.state
    this.props.searchUsers(value, limit, skip).then((users) => {
      users = users.filter((u) => u.id !== currentUserId)
      this.setState({
        users: users,
        noResult: !users.length
      })
    })
  }

  render () {
    const {value, users} = this.state
    const {goBack, friends} = this.props
    return (
      <Container>

        <Content className={'friend-search-content'}>
          <div className={'search-input-container'}>
            <input
              placeholder={'Search friends'}
              type={'text'} value={value} onChange={this.onChange}/>
            <Button onClick={() => {
              if (value !== '') {
                this.clearSearch()
              }
            }}><i className={'md-icon'}>{_.trim(value) !== '' ? 'close' : 'search'}</i></Button>
          </div>
          <Results className={'friend-search-results'}>
            {
              value === '' ? <div className={'first-message'}><span>results will be displayed in this area</span>
              </div> : null
            }
            {
              this.state.noResult && value !== '' ? <div className={'not-found-message'}>
                <strong>No results found.</strong>
                <div className={'tips'}>
                  Useful tips:
                  <ul>
                    <li>Try using a shorter name.</li>
                    <li>Make sure all words are written properly</li>
                  </ul>
                </div>
              </div> : null
            }
            {users.length ? (
              <FriendSearchResult
                onOpenChatWithUser={(user) => {
                  if(this.props.onOpenChatWithUser){
                    this.props.onOpenChatWithUser(user)
                  }
                }}
                onAddFriend={(user) => {

                  let data = users.map((u) => {
                    if (u.id === user.id) {
                      u.friend_request_sent = true
                    }
                    return u
                  })

                  this.setState({
                    users: data,
                  }, () => {

                    this.props.requestAddFriend(user)
                  })

                }}

                friends={friends} users={users}/>
            ) : null}

          </Results>
        </Content>

        {
          goBack ? <Back onClick={() => {
            if (this.props.goBack) {
              this.props.goBack()
            }
          }}><i className={'md-icon'}>keyboard_arrow_left</i> go back</Back> : null
        }
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUserId: _.get(state.app.user, 'id', null),
  friends: state.friend,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchUsers,
  setUser,
  requestAddFriend
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(FriendSearch)