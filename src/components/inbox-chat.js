import React from 'react'
import styled from 'styled-components'
import Chat from './chat'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { onCreateGroup, openInboxChat } from '../redux/actions'

const Empty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  height: ${props => props.h}px;
  .not-found-icon{
    margin-top: 50px;
    margin-bottom: 10px;
    i{
      padding: 3px 5px;
      background: #c4c4c4;
      color: #FFF;
      border-radius: 3px;
      font-size: 40px;
      }
      
    }
    .not-found-message{
      font-size: 40px;
      color: #c4c4c4;
      font-weight: 400;
      text-align: center;
    }
    .helper-message{
      margin-top: 10px;
      font-size: 16px;
      color: #c4c4c4;
      font-weight: 400;
     
      span{
        color: #f8c231;
        cursor: pointer;
      }
    }
`

const Inner = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
`

class InboxChat extends React.Component {

  render () {

    const {chat, height, isEmpty} = this.props

    const group = _.get(chat, 'group', null)
    const isNew = _.get(chat, 'isNew', null)

    return (
      <div className={'main-conversation'}>
        {chat ? <Chat height={height} isNew={isNew} group={group} dock={false}/> : null}
        {isEmpty ? (
          <Empty
            h={height}
            className={'no-conversation'}>
            <Inner className={'not-found-inner'}>
              <div className={'not-found-icon'}>
                <i className={'md-icon'}>priority_high</i>
              </div>
              <div className={'not-found-message'}>
                you don’t have any messages yet
              </div>
              <div className={'helper-message'}>
                get started by creating a <span onClick={() => {
                this.props.openInboxChat([], null, true)
              }}>new message</span> or <span onClick={() => {
                this.props.onCreateGroup()
              }}>chat group</span>
              </div>
            </Inner>
          </Empty>
        ) : null}
      </div>
    )

  }
}

const mapStateToProps = (state) => ({
  chat: state.inbox.active,
  isEmpty: state.app.fetched && state.group.length === 0 && state.inbox.active === null
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onCreateGroup,
  openInboxChat
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InboxChat)