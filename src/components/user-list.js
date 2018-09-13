import React from 'react'
import styled from 'styled-components'
import PropsTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'
import { searchUsers } from '../redux/actions'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  .search-input-container{
    background: #f8f8f8;
    display: flex;
    flex-direction:row;
    padding: 5px 10px;
    border-radius: 5px;
    input{
      font-size: 21px;
      font-style: italic;
      color: #b0b0b0;
      min-height:40px; 
      border: 0 none;
      background: transparent;
      padding: 8px 5px;
      flex-grow: 1;
      height: 40px;
      line-height: 40px;
    }
  }
  .user-list-result-container{
    padding-top: 20px;
    flex-grow: 1;
    border-radius: 8px;
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

const Result = styled.div`
    
    
`
const User = styled.div`
  cursor: pointer;
  padding: 8px 18px;
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
  .is-selected{
    color: #2397e8;
    i{
      color: #2397e8;
    }
  }
  .un-selected{
    color: #484848;
    i{
      color: #484848;
    }
  }
`

const NoResult = styled.div`

  background: #f8f8f8;
  height: 200px;
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
  height: 200px;
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
    background: #f8f8f8;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 8px;
    height: ${props => props.height};
`

const HelpMessage = styled.div`
  font-size: 17px;
  color: #c4c4c4;
  .using-friend-search-action{
    color: #2397e8;
    font-weight: 700;
    cursor: pointer;
  }
`

class UserList extends React.Component {

  constructor (props) {

    super(props)
    this.onSearch = _.debounce(this.search, 300)

  }

  state = {
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

    if (this.props.onSelect) {
      this.props.onSelect(user)
    }
  }

  renderEmptyMessage = () => {

    return (
      <Empty className={'no-friends'}>
        <div className={'person-icons'}>
          <div className={'person-icon'}><i className={'md-icon'}>person</i></div>
          <div className={'person-icon'}><i className={'md-icon'}>person_outline</i></div>
        </div>
        <div className={'msg'}>
          you don’t have any <br/>friends yet<br/>
          <HelpMessage className={'help-message'}>try using <span onClick={() => {
            if (this.props.onOpenFriendSearch) {
              this.props.onOpenFriendSearch()
            }
          }} className={'using-friend-search-action'}>friends search</span></HelpMessage>
        </div>
      </Empty>
    )
  }

  render () {

    let {search, result, noResult} = this.state
    const {placeholder, selected, currentUserId, height} = this.props

    let users = this.props.users

    search = _.trim(search)

    if (search !== '') {
      users = result
    }
    users = users.filter((i) => i.id !== currentUserId && i.blocked === false)

    return (
      <Container className={'user-list'}>
        <div className={'search-input-container'}>
          <input
            placeholder={placeholder}
            type={'text'} value={this.state.search} onChange={this.onChange}/>
          <Button onClick={() => {
            if (search !== '') {
              this.clearSearch()
            }
          }}><i className={'md-icon'}>{search !== '' ? 'close' : 'search'}</i></Button>
        </div>
        <div className={'user-list-result-container'}>
          <Inner
            height={height}
            className={'result-inner'}>
            {
              !search && !users.length ? this.renderEmptyMessage() : null
            }
            {noResult ?
              <NoResult className={'no-result'}>
                <div className={'no-result-icons'}>
                  <i className={'md-icon'}>mood_bad</i>
                  <i className={'md-icon'}>sentiment_dissatisfied</i>
                </div>
                <div className={'no-result-heading'}>
                  no results found
                  <span>try entering a different name</span>
                </div>
              </NoResult> : <Result className={'user-result'}>
                {users.map((user, index) => {
                  const avatar = _.get(user, 'avatar', null)
                  const name = `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`

                  const isSelected = selected.find((u) => u.id === user.id)

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
                      {isSelected ? <div className={'is-selected'}>
                        <i className={'md-icon'}>check_circle</i>
                      </div> : <div className={'un-selected'}>
                        <i className={'md-icon'}>radio_button_unchecked</i>
                      </div>}

                    </User>
                  )
                })}
              </Result>}
          </Inner>
        </div>

      </Container>
    )
  }
}

UserList.defaultProps = {
  height: '200px',
  placeholder: 'Search people to add...'
}

UserList.propsTypes = {
  height: PropsTypes.any,
  onSelect: PropsTypes.func,
  selected: PropsTypes.array,
}
const mapStateToProps = (state) => ({
  users: state.user,
  currentUserId: _.get(state.app.user, 'id', null)
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchUsers,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UserList)