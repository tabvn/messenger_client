import React from 'react'
import styled from 'styled-components'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUnreadCount } from '../redux/selector/group'

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 17px 0 30px 0;
  ${props => !props.dock ? 'background: #efefef' : null}
`
const Count = styled.div`
  color: #484848;
  font-weight: 700;
  font-size: ${props => props.count > 100 ? 20 : 35}px;
  text-overflow: ellipsis; 
  overflow: hidden; 
  white-space: nowrap;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #484848;
`

class SidebarUnread extends React.Component {

  render () {
    const {count, dock} = this.props

    return (
      <Container
        dock={dock}
        className={'sidebar-unread'}>
        <Count count={count} className={'unread-count'}>{count}</Count>
        <Title className={'unread-title'}>unread</Title>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  count: getUnreadCount(state)
})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SidebarUnread)