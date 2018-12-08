import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import _ from 'lodash'
import {responseInvite} from '../redux/actions'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  top: 74px;
  left: 0;
  right: 0;
  padding: 20px;
  position: absolute;
  background: #f8c231;
  z-index:1000;
  .notify-message{
    font-size: 15px;
    color: #000000;
    strong{
      font-weight: 700;
      color: #000;
      font-size: 15px;
    }
   }

`
const Button = styled.button`
  background: #FFF;
  color: #484848;
  fonts-size: 15px;
  font-weight: 700;
  padding: 10px 18px;
  text-align: center;
  margin:0;
  outline: 0 none;
  border: 0 none;
  border-radius: 5px;
  cursor: pointer;
  &:active,&:focus{
    outline: 0 none;
  }
  &.btn-color{
    background: #2397e8;
    margin-right: 10px;
    color: #FFF;
 
  }
  &:hover{
    opacity: 0.88;
  }
`

const Actions = styled.div`
  padding-top: 30px;
  display: flex;
  flex-direction: row;
`

class InviteNotify extends React.Component {

  render () {
    const {currentUserId, group,groupId, chat} = this.props

    const member = _.get(group, 'members', []).find((m) => m.user_id === currentUserId && m.accepted === 0 || m.accepted === 2)
    let addedBy = null
    if (member) {
      addedBy = group.users.find((u) => u.id === member.added_by)
    }
    return (
      addedBy && member.accepted === 0 ? <Container>

        <div className={'notify-message'}>
          <strong>{_.get(addedBy, 'first_name', '')} {_.get(addedBy, 'last_name', '')}</strong> has requested to add you
          to the group chat below
        </div>

        <Actions className={'remove-group-user-actions'}>
          <Button onClick={() => {
            this.props.responseInvite(groupId, true)
          }} className={'btn-color'}>Accept</Button>

          <Button onClick={() => {
            this.props.responseInvite(groupId, false, _.get(chat, 'id', null))
          }} className={'btn-cancel'}>Deny</Button>

        </Actions>


      </Container> : null
    )
  }
}

const mapStateToProps = (state, props) => ({
  group: state.group.find((g) => g.id === props.groupId)
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  responseInvite
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InviteNotify)