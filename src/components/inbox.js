import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Sidebar from './sidebar'
import InboxChat from './inbox-chat'
import {openInboxChat} from '../redux/actions'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: ${props => props.h}px;
`
const LeftPanel = styled.div`
  width: ${props => props.w}px;
  display: flex;
  flex-direction: column;
`

const Main = styled.div`
  flex-grow: 1;
`

class Inbox extends React.Component {

  state = {
    wH: window.innerHeight,
  }

  componentDidMount() {

    window.addEventListener('resize', this.resize.bind(this))
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
    const {sidebarIsOpen, offset} = this.props

    const w = sidebarIsOpen ? 242 : 75

    const containerH = wH - offset

    return (
        <Container
            h={containerH}
            className={'messenger-inbox'}>
          <LeftPanel
              w={w}
              className={'inbox-left-panel'}>
            <Sidebar
                height={containerH}
                dock={false}
                onCreateConversation={() => {

                  this.props.openInboxChat([], null, true)
                }}
                onCreateGroup={(g) => {

                  this.props.openInboxChat(g.users, g)
                }}
                onSelect={(group, users) => {
                  this.props.openInboxChat(users, group)

                }}
            />
          </LeftPanel>
          <Main className={'inbox-main'}>
            <InboxChat height={containerH}/>
          </Main>

        </Container>
    )
  }

}

const mapStateToProps = (state) => ({
  sidebarIsOpen: state.sidebar.open,
  offset: _.get(state.app, 'theme.offset', 0),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  openInboxChat,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Inbox)