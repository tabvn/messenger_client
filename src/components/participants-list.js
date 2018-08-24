import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`

  .inner{
    overflow-x: hidden;
    overflow-y: auto;
    height: ${props => props.h}px;
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
  .participants-user-avatar{
    position: relative;
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
  .participants-user-name{
    padding-left: 5px;
    text-align: left;
    flex-grow: 1;
    color: #484848;
    font-size: 16px;
    font-weight: 400;
      
  }
`

const Remove = styled.button`
  color: #FFF;
  cursor: pointer;
  border: 0 none;
  font-size: 15px;
  background: #c0c0c0;
  border-radius: 3px;
  padding: 5px 8px;
  margin: 0;
  outline: 0 none;
  &:hover,&:active,&:focus{
    outline: 0 none;
  }
`

const Status = styled.div`
    text-align: left;
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

export default class ParticipantsList extends React.Component {

  handleRemoveUser = (user) => {
    if (this.props.onRemoveUser) {
      this.props.onRemoveUser(user)
    }
  }

  render () {

    const {users, height} = this.props

    return (
      <Container
        h={height}
        className={'participants-list'}>

        <div className={'inner'}>
          {users.map((user, index) => {
            const avatar = _.get(user, 'avatar', null)
            const name = `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`
            const status = _.get(user, 'status', 'offline')

            return (
              <User
                key={index} className={'participants-result'}>
                <div className={'participants-user-avatar'}>
                  {avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon'}>person_outline</i>}
                  <Status className={`user-status ${status}`}/>

                </div>
                <div className={'participants-user-name'}>{name}</div>
                <Remove
                  onClick={() => this.handleRemoveUser(user)}
                  className={'remove-participant'}>Remove</Remove>
              </User>
            )
          })}
        </div>
      </Container>)
  }
}