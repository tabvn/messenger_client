import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { changeSidebarTab } from '../redux/actions'
import { connect } from 'react-redux'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  
`

const Tab = styled.div`
  ${props => !props.active ? 'cursor: pointer;' : null}
  padding: 10px 10px;
  text-align: center;
  font-size: 16px;
  flex-grow: 1;
  color: ${props => props.active ? '#484848' : '#FFF'};
  background: ${props => props.active ? '#efefef' : '#7f7f7f'};
  &.dock{
    color: ${props => props.active ? '#FFF' : '#484848'};
    background: ${props => props.active ? '#7f7f7f' : '#FFF'};
  }
`

const tabs = [
  'Messages',
  'Friends'
]

class SidebarTabs extends React.Component {

  render () {

    const {active, dock} = this.props

    return (
      <Container
        className={'sidebar-tabs'}>
        {
          tabs.map((title, index) => {
            return (
              <Tab
                dock={dock}
                onClick={() => {
                  this.props.changeSidebarTab(index)

                }}
                className={`sidebar-tab-item ${dock ? 'dock ' : ''} ${active === index ? 'active' : 'inactive'}`}
                active={active === index}
                key={index}>{title}</Tab>)
          })
        }
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  open: state.sidebar.open,
  active: state.sidebar.activeTabIndex,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  changeSidebarTab
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SidebarTabs)