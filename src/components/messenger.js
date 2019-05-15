import React from 'react'
import styled from 'styled-components'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Sidebar from './sidebar'
import Chats from './chats'
import {
  openChat,
  createChat,
  removeInboxActive,
  createConversation,
} from '../redux/actions'
import _ from 'lodash'

const Dock = styled.div`
  position: fixed;
  bottom: 0;
  left: auto;
  right: ${props => props.right}px;
  height: 100%;
  @media (max-width: 991px) {
    &.is-closed{
      right: -10px;
    }
  }
  @media (max-width: 375px) {
   left: 0;
   margin: 0;
   &.is-closed{
      right: 0;
    }
  }
  .dock-inner{
    display: flex;
    flex-direction: row;
    overflow: auto;
    height: 100%;
  }
`

class Messenger extends React.Component {

  state = {
    wH: window.innerHeight,
  }

  componentDidMount() {

    window.addEventListener('resize', this.resize.bind(this))

    document.body.classList.add('ar-messenger')
    this.props.removeInboxActive()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize.bind(this))
  }

  resize() {

    this.setState({
      wH: window.innerHeight,
    })
  }

  render() {

    const {wH} = this.state
    const {sidebarIsOpen, tabs,currentUserId} = this.props
    let px = sidebarIsOpen ? 275 : 80

    return (
        currentUserId ? <div className={'messenger-container'}>
          <Sidebar
              height={wH}
              dock={true}
              onCreateConversation={() => {
                this.props.createChat()
              }}
              onCreateGroup={(g) => {

                let userIds = []

                g.users.forEach((u) => {
                  userIds.push(u.id)
                })
                this.props.createConversation(null, userIds, g)
                //this.props.openChat(g.users, g)
              }}
              onSelect={(group, users) => {

                this.props.openChat(users, group)
              }}/>
          {
            tabs.length ? (
                <Dock right={px} className={`dock-container ${sidebarIsOpen ?
                    'is-open' :
                    'is-closed'}`}>
                  <div className={'dock-inner'}>
                    <Chats/>
                  </div>

                </Dock>
            ) : null
          }
        </div> : null
    )
  }
}

const mapStateToProps = (state) => ({
  sidebarIsOpen: state.sidebar.open,
  tabs: state.chat.tabs,
  currentUserId: _.get(state.app.user, 'id', null),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  openChat,
  createChat,
  removeInboxActive,
  createConversation,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Messenger)