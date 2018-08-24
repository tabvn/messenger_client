import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { toggleSidebar } from '../redux/actions'

const Container = styled.div`
  padding: 0;
`
const Button = styled.button`
  padding: 3px;
  margin-left: 5px;
  cursor: pointer;
  color: #b0b0b0;
  border: 0 none;
  outline: 0 none;
  background: none;
  &:active, &:focus{
    outline: 0 none;
  }
`

class SidebarHeaderActions extends React.Component {

  render () {

    const {open, dock} = this.props

    return (
      <Container className={'sidebar-header-actions'}>
        {open && <Button
          onClick={() => {
            if (this.props.onCreateConversation) {
              this.props.onCreateConversation()
            }
          }}
          className={'create-conversation'}><i className={'md-icon md-24'}>edit</i></Button>}
        {open && <Button onClick={() => {
          if (this.props.onCreateGroup) {
            this.props.onCreateGroup()
          }
        }} className={'create-group-conversation'}><i className={'md-icon md-24'}>group</i></Button>}
        <Button onClick={() => this.props.toggleSidebar(!open)} className={'toggle-sidebar'}>
          {
            dock ? (
              <i
                className={'md-icon md-24'}>{open ? 'keyboard_arrow_right' : 'keyboard_arrow_left'}</i>
            ) : (
              <i
                className={'md-icon md-24'}>{open ? 'keyboard_arrow_left' : 'keyboard_arrow_right'}</i>
            )
          }
        </Button>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  open: state.sidebar.open,

})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleSidebar
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SidebarHeaderActions)