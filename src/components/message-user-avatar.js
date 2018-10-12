import React, { Fragment } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'

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
  &:hover{
    .messenger-user-tooltip{
      display: block;
    }
  }
`

const Empty = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: none;
`

const ArrowBox = styled.div`
  color: #FFF;
  position: relative;
	background: #000000;
	border: 1px solid #000000;
	border-radius: 5px;
	padding: 5px 10px;
	&:after,&:before{
	  right: 100%;
    top: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
	}
	&:after{
	  border-color: rgba(0, 0, 0, 0);
	  border-right-color: #000000;
	  border-width: 5px;
	  margin-top: -5px;
	}
	&:before{
	  border-color: rgba(0, 0, 0, 0);
	  border-right-color: #000000;
	  border-width: 6px;
	  margin-top: -6px;
	}
`

const ToolTip = styled.div`
  display: none;
  color: #FFF;
  font-size: 18px;
  position: absolute;
  top: 2px;
  left: 46px;
  z-index: 2;
`

export default class MessageUserAvatar extends React.Component {
  render () {
    const {user, hide, tooltipMessage} = this.props
    const avatar = _.get(user, 'avatar', '')

    const firstName = _.get(user, 'first_name', '')
    const lastName = _.get(user, 'last_name', '')

    return (
      <Fragment>
        {!hide ?
          (
            <Container title={`${firstName} ${lastName}`} className={'message-user-avatar'}>
              {avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon md-24'}>person_outline</i>}
              <ToolTip
                className={'messenger-user-tooltip'}>
                <ArrowBox>
                  {tooltipMessage}
                </ArrowBox>
              </ToolTip>
            </Container>

          ) : <Empty/>}
      </Fragment>
    )

  }
}