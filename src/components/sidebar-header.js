import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateUserStatus } from '../redux/actions'
import SidebarUserStatus from './sidebar-user-status'
import SidebarHeaderActions from './sidebar-header-actions'

const Container = styled.div`
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background: ${props => props.dock ? '#efefef' : '#fdfdfd'};
  `


class SidebarHeader extends React.Component {

  render () {

    const {open, dock} = this.props
    return (
      <Container
        dock={dock}
        className={'sidebar-header'}>
        {open && <SidebarUserStatus/>}
        <SidebarHeaderActions
          dock={dock}
          onCreateConversation={() => {
            if (this.props.onCreateConversation) {
              this.props.onCreateConversation()
            }
          }}
          onCreateGroup={() => {

            if (this.props.onCreateGroup) {
              this.props.onCreateGroup()
            }
          }}/>

      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  open: state.sidebar.open,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateUserStatus
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeader)