import React from 'react'
import styled from 'styled-components'
import BlockUserDialog from './block-user-dialog'
import { blockUser, closeChat, removeGroup } from '../redux/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  
  
`

const Button = styled.button`
  border: 0 none;
  background: none;
  padding: 0;
  margin: 0;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  outline: 0 none;
  cursor: pointer;
  &:hover,&:active, &:focus{
    outline: 0 none;
  }
  i{
    color: #f8c231;
    font-size: 30px;
  }
`

const Text = styled.span`
  display: block;
  text-align: center;
  font-weight: 300;
  font-size: 20px;
  color: #000;
  width: 90px;
`

const Footer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-content: flex-end;
  justify-content: flex-end;
  width: 100%;
`

const Buttons = styled.div`
  height: 100px;
  display: flex;
  flex-direction: row;
  background: #FFF;
  border-radius: 8px;
  width: 100%;
`

const Dialog = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

class ChatOptionsModal extends React.Component {
  state = {
    dialog: null
  }

  handleBlockUser = (yes) => {

    const {tab, dock, users, group} = this.props

    this.setState({
      dialog: null
    }, () => {
      if (yes) {
        if (tab && dock) {
          // handle close tab chat
          this.props.closeChat(tab.id)
        }
        const userId = _.get(users, '[0].id')
        // block a user
        this.props.blockUser(userId)

        const groupId = _.get(group, 'id')
        if (groupId) {
          // let remove group

          this.props.removeGroup(groupId)
        }

      }
    })
  }

  render () {

    const {dialog} = this.state
    const {users} = this.props

    const isGroup = users.length > 1

    return (
      <Container className={'chat-options'}>

        <Dialog className={'chat-options-dialog'}>
          {dialog === 'block' ? <BlockUserDialog onClose={this.handleBlockUser}/> : null}
        </Dialog>

        {
          dialog === null ? (
            <Footer className={'chat-options-footer'}>
              <Buttons className={'buttons'}>
                <Button
                  onClick={() => {
                    if (this.props.onOpenModal) {
                      this.props.onOpenModal('participants')
                    }
                  }}
                  className={'option-settings'}>
                  <i className={'md-icon'}>settings</i>
                  <Text>Chat options</Text>
                </Button>


                <Button
                  onClick={() => {
                    if (isGroup) {
                      if (this.props.onOpenModal) {
                        this.props.onOpenModal('block')
                      }
                    } else {
                      this.setState({
                        dialog: 'block'
                      })
                    }

                  }}
                  className={'option-block'}>
                  <i className={'md-icon'}>block</i>
                  <Text>{isGroup ? 'Block this group' : 'Block this user'}</Text>
                </Button>

                <Button
                  onClick={() => {
                    if (this.props.onOpenModal) {
                      this.props.onOpenModal('flag')
                    }
                  }}
                  className={'option-block'}>
                  <i className={'md-icon'}>flag</i>
                  <Text>Report this {users.length > 1 ? 'group' : 'user'}</Text>
                </Button>

              </Buttons>
            </Footer>
          ) : null
        }
      </Container>)
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  closeChat,
  blockUser,
  removeGroup
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChatOptionsModal)