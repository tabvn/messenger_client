import React, { Fragment } from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Conversations from './conversations'
import SidebarSearch from './sidebar-search'
import { archiveGroup, searchFriends, searchGroups, setSidebarSearch } from '../redux/actions'
import { getGroups } from '../redux/selector/group'
import Friends from './friends'
import { getFriends } from '../redux/selector/friend'

const Container = styled.div`
  flex-grow: 1;
  ${props => !props.dock ? 'background: #efefef' : null}
`

const LIMIT = 50

class SidebarContent extends React.Component {

  state = {
    fetched: false,
    search: '',
  }
  handleClose = (g) => {

    this.props.archiveGroup(g.id)
  }
  handleSelect = (group, users) => {

    if (this.props.onSelect) {
      this.props.onSelect(group, users)
    }
  }

  handleSearch = (search) => {
    const {activeTab} = this.props

    this.props.setSidebarSearch(search)

    if (search === '') {
      this.setState({
        search: '',
        fetched: false
      })

      return
    }
    if (activeTab === 0) {

      this.setState({
        search: search,
        fetched: false
      }, () => {
        this.props.searchGroups(search).then(() => {
          this.setState({
            fetched: true
          })
        })
      })

    } else {
      // search contacts
      this.setState({
        search: search,
        fetched: false
      }, () => {

        this.props.searchFriends(search).then(() => {
          this.setState({
            fetched: true
          })
        })
      })

    }

  }

  handleLoadMoreConversations = () => {

    const {groups} = this.props

    this.setState({
      fetched: false
    }, () => {

      this.props.searchGroups(this.state.search, LIMIT, groups.length).then(() => {
        this.setState({
          fetched: true
        })
      })

    })
  }

  render () {

    const {activeTab, sidebarIsOpen, groups, friends, search, appFetched, dock, height} = this.props

    return (
      <Fragment>
        <Container
          dock={dock}
          className={'sidebar-main-content'}>
          {activeTab === 0 &&
          (
            <Conversations
              onLoadMore={this.handleLoadMoreConversations}
              dock={dock}
              sidebarIsOpen={sidebarIsOpen}
              height={height}
              onCreateConversation={() => {
                if (this.props.onCreateConversation) {
                  this.props.onCreateConversation()
                }
              }}
              search={search}
              appIsFetched={appFetched}
              searchIsDone={this.state.fetched}
              groups={groups} onClose={this.handleClose}
              onSelect={this.handleSelect}/>)}
          {activeTab === 1 && (
            <Friends
              sidebarIsOpen={sidebarIsOpen}
              height={height}
              onSelect={(user) => {
                if (this.props.onSelect) {
                  this.props.onSelect(null, [user])
                }

              }}
              appIsFetched={appFetched}
              search={search}
              searchIsDone={this.state.fetched}
              users={friends}/>
          )}
        </Container>
        {sidebarIsOpen && (
          <SidebarSearch
            dock={dock}
            onSearch={(v) => this.handleSearch(v)}
            searchType={activeTab === 0 ? 'message' : 'user'}/>
        )}
      </Fragment>

    )
  }
}

const mapStateToProps = (state, props) => ({
  activeTab: state.sidebar.activeTabIndex,
  sidebarIsOpen: state.sidebar.open,
  groups: getGroups(state, props),
  friends: getFriends(state, props),
  search: state.sidebar.search,
  appFetched: state.app.fetched,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchGroups,
  setSidebarSearch,
  searchFriends,
  archiveGroup
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContent)