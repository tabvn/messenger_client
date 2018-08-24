import React, { Fragment } from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`

  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #009beb;
  display: flex;
  align-items: center;
  justify-content: center;
  i{
    color: #FFF;
  }
  img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`

const Empty = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: none;
`

export default class MessageUserAvatar extends React.Component {

  render () {
    const {user, hide} = this.props
    const avatar = _.get(user, 'avatar', '')

    const firstName = _.get(user, 'first_name', '')
    const lastName = _.get(user, 'last_name', '')


    return (
      <Fragment>
        {!hide ? <Container title={`${firstName} ${lastName}`} className={'message-user-avatar'}>
          {avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon md-24'}>person_outline</i>}
        </Container> : <Empty/>}
      </Fragment>
    )

  }
}