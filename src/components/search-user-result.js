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

export default class SearchUserResult extends React.Component {

  render () {

    const {users} = this.props

    return (
      <Container className={'search-user-result'}>
        <div className={'inner'}>
          {users.map((user, index) => {
            const avatar = _.get(user, 'avatar', null)
            const name = `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`
            return (
              <User
                onClick={() => {
                  if(this.props.onSelect){
                    this.props.onSelect(user)
                  }

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
      </Container>)

  }
}