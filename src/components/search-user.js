import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import SearchUserResult from './search-user-result'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { searchUsers, setUser, requestAddFriend } from '../redux/actions'

const Container = styled.div`
  .search-input-container{
    background: #f8f8f8;
    display: flex;
    flex-direction:row;
    padding: 0 5px;
    border-radius: 5px;
    input{
      font-size: 15px;
      font-style: italic;
      color: #b0b0b0;
      min-height:40px; 
      border: 0 none;
      background: transparent;
      padding: 8px 10px;
      flex-grow: 1;
      max-width: 180px;
    }
  }
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

class SearchUser extends React.Component {

  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
    this.search = this.search.bind(this)
    this.onSearch = _.debounce(this.search, 300)

    this.state = {
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

  search = () => {

    const {currentUserId} = this.props
    if (_.trim(this.state.value) === '') {

      this.setState({
        users: [],
      })

      return
    }
    this.props.searchUsers(this.state.value, this.state.limit, this.state.skip).then((users) => {

      users = users.filter((u) => u.id !== currentUserId)
      this.setState({
        users: users
      })

    }).catch((e) => {

      this.setState({
        users: []
      })
    })
  }

  render () {

    const {value, users} = this.state

    return (
      <Container className={'search-user'}>
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

        <SearchUserResult
          onSelect={(user) => {
            if (this.props.onSelect) {
              this.props.setUser(user)
              this.props.onSelect(user)
            }
          }}
          onRequestAddFriend={(user) => {
            let data = users.map((u) => {
              if (u.id === user.id) {
                u.friend_request_sent = true
              }
              return u
            })

            this.setState({
              users: data
            }, () => {

              this.props.requestAddFriend(user)
            })
          }}
          users={users}/>

      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUserId: _.get(state.app.user, 'id', null)
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchUsers,
  setUser,
  requestAddFriend
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser)