import React, { Fragment } from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { toggleSidebar } from '../redux/actions'
import connect from 'react-redux/es/connect/connect'
import SidebarHeader from './sidebar-header'
import SidebarTabs from './sidebar-tabs'
import SidebarContent from './sidebar-content'
import SidebarUnread from './sidebar-unread'
import SidebarFooter from './sidebar-footer'
import Modal from './modal'
import CreateGroup from './create-group'
import PropTypes from 'prop-types'
import { ON_CREATE_GROUP } from '../redux/types'
import FriendSearch from './friend-search'

const Container = styled.div`
  width: ${props => props.open ? '242' : '75'}px;
  position: ${props => props.dock ? 'fixed' : 'relative'};
  z-index: ${props => props.dock ? '100000' : 0};
  background: #FFF;
  display: flex;
  flex-direction: column;
  &.dock{
    bottom: 0;
    top:0;
    right: 0;
    box-shadow: -2px 0px 1px 1px rgba(0,0,0,0.05);
    
  }
  &.not-dock{
    flex-grow: 1;
  }
  
  @media (max-width: 991px) {
     &.dock{
      &.is-closed{
        display: none;
      }
     }
  }
    
  
`

const MobileButton = styled.button`

  display: none;
  border-radius: 50%;
  background-color: rgb(18, 66, 106);
  opacity: 0.9;
  position: fixed;
  left: 18px;
  top: auto;
  bottom: 18px;
  width: 60px;
  z-index: 100000;
  height: 60px;
  border: 0 none;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 6px 10px 0px rgba(0, 0, 0, 0.14),0px 1px 18px 0px rgba(0, 0, 0, 0.12)
  transition: all 0.3s ease 0s;
  cursor: pointer;
  padding: 0;
  margin: 0;
  outline: none;
  &:active,&:focus{
    outline: 0 none;
  }
  &:hover{
    opacity: 0.7;
  }
  
  i{
    color: #FFF;
    font-size: 28px;
  }
  
   @media (max-width: 991px) {
     display: block;
  }
`

class Sidebar extends React.Component {

  state = {
    createGroup: false,
    friendSearch: false
  }

  componentDidMount () {

    this.onCreateGroup = this.props.event.addListener(ON_CREATE_GROUP, () => {
      this.setState({
        createGroup: true
      })
    })
  }

  componentWillUnmount () {
    if (this.onCreateGroup) {
      this.onCreateGroup.remove()
    }

  }

  render () {
    const {open, dock, height} = this.props

    return (
      <Fragment>
        <Container
          dock={dock}
          open={this.props.open}
          className={`sidebar-container${dock ? ' dock' : ' not-dock'}${open ? ' is-open' : ' is-closed'}`}>
          <SidebarHeader
            dock={dock}
            onCreateConversation={() => {
              if (this.props.onCreateConversation) {
                this.props.onCreateConversation()
              }
            }}
            onCreateGroup={() => {
              this.setState({
                createGroup: true
              })
            }}
          />
          {!open && <SidebarUnread dock={dock}/>}
          {open && <SidebarTabs dock={dock}/>}
          <SidebarContent
            height={height}
            onCreateConversation={() => {
              if (this.props.onCreateConversation) {
                this.props.onCreateConversation()
              }
            }}
            dock={dock}
            onSelect={(group, users) => {
              if (this.props.onSelect) {
                this.props.onSelect(group, users)
              }
            }}/>
          <SidebarFooter
            dock={dock}
            onCreateConversation={() => {
              if (this.props.onCreateConversation) {
                this.props.onCreateConversation()
              }
            }}
            onCreateGroup={() => {
              this.setState({
                createGroup: true
              })
            }}/>

          {
            this.onCreateGroup && (
              <Modal
                onClose={() => {
                  this.setState({
                    createGroup: false
                  })
                }}
                title={'Create group'}
                open={this.state.createGroup}>

                <CreateGroup
                  onOpenFriendSearch={() => {
                    this.setState({
                      friendSearch: true,
                      createGroup: false,
                    })
                  }}
                  onCreate={(e) => {
                    if (this.props.onCreateGroup) {
                      this.props.onCreateGroup(e)
                    }
                    // close modal
                    this.setState({
                      createGroup: false
                    })
                  }}
                  onClose={() => {
                    this.setState({
                      createGroup: false,
                    })
                  }}/>
              </Modal>
            )
          }

          {
            this.state.friendSearch && (
              <Modal
                title={'Add friends'}
                open={this.state.friendSearch}>

                <FriendSearch goBack={() => {
                  this.setState({
                    friendSearch: false,
                    createGroup: true,
                  })
                }}/>
              </Modal>
            )
          }

        </Container>
        {
          dock && !open ? <MobileButton
            onClick={() => {
              this.props.toggleSidebar(!open)
            }}
            className={'messenger-mobile-toggle'}>
            <i className={'md-icon'}>chat_bubble</i>
          </MobileButton> : null
        }
      </Fragment>

    )
  }
}

Sidebar.defaultProos = {
  dock: false,
}
Sidebar.propTypes = {
  onCreateGroup: PropTypes.func,
  onSelect: PropTypes.func,
  dock: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  open: state.sidebar.open,
  event: state.sidebar.event,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleSidebar
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)