import React from 'react'
import styled from 'styled-components'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Sidebar from './sidebar'
import Chats from './chats'
import {openChat, createChat, removeInboxActive} from '../redux/actions'

const Dock = styled.div`
  position: fixed;
  bottom: 0;
  left: auto;
  right: ${props => props.right}px;
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
    const {sidebarIsOpen, tabs} = this.props
    let px = sidebarIsOpen ? 275 : 80

    return (
        <div className={'messenger-container'}>
          <Sidebar
              height={wH}
              dock={true}
              onCreateConversation={() => {
                this.props.createChat()
              }}
              onCreateGroup={(g) => {

                this.props.openChat(g.users, g)
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
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  sidebarIsOpen: state.sidebar.open,
  tabs: state.chat.tabs,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  openChat,
  createChat,
  removeInboxActive,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Messenger)