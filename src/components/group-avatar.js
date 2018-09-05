import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`
  position:relative;
  width: 60px;
  height: 45px;
  overflow: hidden;
`

const Avatar = styled.div`
  background: #165776;
  border-radius: 50%;
  color: #FFF;
  position: absolute;
  left: 0;
  top: 0;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e5e7e8;
  &:last-child{
    left: 10px;
  }
  img{
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
  }
  i{
    color: #FFF;
    font-size: 28px;
  }
`

export default class GroupAvatar extends React.Component {

  firstTwoUsers = () => {

    const {users} = this.props

    let u = []

    for (let i = 0; i < users.length; i++) {
      if (u.length > 2) {
        break
      }
      u.push(users[i])
    }

    u.sort((a, b) => {

      if (b.avatar) {
        return -1
      }
      if (a.avatar) {
        return 1
      }
      if (a.avatar && b.avatar) {
        return 0
      }
      return 0
    })

    return u

  }

  render () {

    const users = this.firstTwoUsers()

    return (
      <Container className={'chat-group-avatar'}>
        {
          users.map((u, index) => {
            const avatar = _.get(u, 'avatar', null)
            return (
              <Avatar key={index} className={'chat-group-user-avatar'}>
                {avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon'}>person_outline</i>}
              </Avatar>
            )
          })
        }
      </Container>
    )
  }
}