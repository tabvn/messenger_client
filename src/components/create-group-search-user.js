import React, {Fragment} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import UserList from './user-list'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
     flex-direction: column;
  }
  .create-group-user-list{
    flex-grow: 1;
    padding-right: 10px;
  }
`

const SelectedList = styled.div`
  margin-left: 10px;
  width: 223px;
  min-height: 270px;
  border-radius: 8px;
  background: #f8f8f8;
  .no-selected{
    color: #b0b0b0;
    font-size: 21px;
    padding: 20px;
  }
  .user-result{
    flex-direction: row;
  }
`

const User = styled.div`
  cursor: pointer;
  padding: 8px 18px;
  display: flex;
  flex-direction: column;
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

class CreateGroupSearchUsers extends React.Component {

  state = {
    selected: [],
  }

  handleSelectUser = (user) => {

    let users = [...this.state.selected]

    const isExist = this.state.selected.find((u) => u.id === user.id)

    if (isExist) {
      users = users.filter((u) => u.id !== user.id)
    } else {
      users.push(user)
    }

    this.setState({
      selected: users,
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(users)
      }
    })
  }

  renderSelectedList = () => {

    return (
        <Fragment>
          {this.state.selected.map((user, index) => {
            const avatar = _.get(user, 'avatar', null)
            const name = `${_.get(user, 'first_name', '')} ${_.get(user,
                'last_name', '')}`
            return (
                <User
                    onClick={() => {
                      this.handleSelectUser(user)

                    }}
                    key={index} className={'user-result'}>
                  <div className={'search-user-avatar'}>
                    {avatar ? <img src={avatar} alt={''}/> : <i
                        className={'md-icon'}>person_outline</i>}
                  </div>
                  <div className={'search-user-name'}>{name}</div>
                </User>
            )
          })}
        </Fragment>
    )
  }

  render() {

    const {selected} = this.state

    return (
        <Container className={'create-group-search-users'}>

          <div className={'create-group-user-list'}>
            <UserList
                onOpenFriendSearch={() => {
                  if (this.props.onOpenFriendSearch) {
                    this.props.onOpenFriendSearch()
                  }
                }}
                onSelect={this.handleSelectUser}
                selected={this.state.selected}
                placeholder={'Search people to add...'}/>
          </div>
          <SelectedList className={'group-user-selected'}>
            {
              selected.length ? (this.renderSelectedList()) : (
                  <div className={'no-selected'}>
                    Chat participants will be added here
                  </div>
              )
            }
          </SelectedList>
        </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  users: state.user,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(
    CreateGroupSearchUsers)