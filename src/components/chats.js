import React from 'react'
import styled from 'styled-components'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Chat from './chat'

const Container = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
 
`

const Tab = styled.div`
  width: 375px;
  max-height: 700px;
  position: relative;
  box-shadow: 0 1px 4px rgba(0,0,0,.3);
  margin: 0 5px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  z-index: 100000;
  @media (max-width: 375px) {
   width: 100%;
   margin: 0;
   max-height: 100%;
  }
`

class Chats extends React.Component {

  render() {

    const {tabs, groups} = this.props

    return (
        tabs.length ? (
            <Container className={'chat-tabs'}>
              {

                tabs.map((tab, index) => {
                  const isNew = tab.isNew

                  const group = groups.find((g) => g.id === tab.group.id)

                  return (
                      <Tab key={index} className={'chat-tab'}>
                        <Chat isNew={isNew} tab={tab}
                              group={group ? group : tab.group}
                              dock={true}/>
                      </Tab>
                  )
                })
              }


            </Container>
        ) : null
    )
  }
}

const mapStateToProps = (state) => ({
  tabs: state.chat.tabs,
  groups: state.group,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Chats)