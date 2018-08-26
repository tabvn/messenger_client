import React, { Fragment } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ChatHeader from './chat-header'
import { getGroupUnreadCount, getGroupUsers } from '../redux/selector/group'
import Messages from './messages'
import { getGroupMessages } from '../redux/selector/message'
import { closeChat, loadMessages, sendMessage, setActiveChat, toggleChat, updateMessage } from '../redux/actions'
import Composer from './composer'
import { maxUploadSize } from '../config'
import ChatModal from './chat-modal'
import GifModal from './gif-modal'
import EmojiModal from './emoji-modal'
import ChatOptionsModal from './chat-options-modal'
import ChatParticipantsModal from './chat-participants-modal'
import CreateSingleChat from './create-single-chat'

const Container = styled.div`
  flex-grow: 1;
  .chat-messages{
    overflow: hidden;
  }
`

const ChatMessages = styled.div`
  display: ${props => props.hide ? 'none' : 'block'};
  position: relative;
  background: #FFF;
`

const LIMIT = 10

class Chat extends React.Component {

  state = {
    files: [],
    gif: '',
    modal: null,
    emoji: null,
    edit: null,
    isLoadingMore: false
  }

  componentDidMount () {
    const {group} = this.props

    const groupId = _.get(group, 'id')
    if (groupId) {
      this.props.loadMessages(groupId, LIMIT, 0)
    }

  }

  handleOnEditMessage = (message) => {

    this.setState({
      edit: message
    })

  }
  activeChat = () => {

    const {active} = this.props
    if (active) {
      return
    }
    if (this.props.dock && this.props.tab) {
      this.props.setActiveChat(this.props.tab)
    }

  }

  showModal = (name) => {

    this.setState({
      modal: this.state.modal === name ? null : name
    })
  }

  send = (msg) => {
    const {group, users, currentUserId} = this.props

    if (this.state.edit) {

      if (this.state.edit.body !== msg.body) {

        let editMessage = this.state.edit

        editMessage.emoji = msg.emoji
        editMessage.body = msg.body
        this.props.updateMessage(editMessage.id, editMessage, true)
      }

    } else {

      let userIds = []
      if (users.length) {
        users.forEach((u) => {
          userIds.push(u.id)
        })
      }
      msg.files = this.state.files
      msg.user_id = currentUserId
      msg.gif = this.state.gif
      this.props.sendMessage(msg, group, userIds)

    }

    this.setState({
      gif: '',
      files: [],
      edit: null
    })
  }
  onAddFiles = (files) => {

    let _files = this.state.files

    if (!files.length) {
      return
    }
    for (let i = 0; i < files.length; i++) {

      const f = files[i]

      if (f.size <= maxUploadSize) {
        _files.push(f)
      } else {

        alert('File too large. Allow upload file less than 30Mb')
      }

    }

    _files = _.uniqBy(_files, 'name')

    this.setState({
      files: _files
    })

  }

  onRemoveFile = (file) => {

    let files = this.state.files.filter((f) => f.name !== file.name)
    this.setState({
      files: files
    })
  }

  clickOutSide = () => {
    this.setState({modal: null})
  }
  renderModal = () => {
    const {modal} = this.state
    const {users, group, dock, height} = this.props

    return <Fragment>
      {
        modal === 'gif' && (
          <ChatModal
            onClickOutSide={this.clickOutSide}>
            <GifModal
              height={height}
              dock={dock}
              onSelect={(g) => {
                this.setState({
                  gif: g.id,
                  modal: null,
                }, () => this.send({gif: g.id, files: [], body: ''}))
              }}/>
          </ChatModal>)

      }

      {
        modal === 'emoji' && (
          <ChatModal
            onClickOutSide={this.clickOutSide}>
            <EmojiModal
              height={height}
              dock={dock}
              onSelect={(emoji) => {
                this.setState({
                  emoji: emoji.emoji,
                  modal: null,
                })
              }}/>
          </ChatModal>)

      }

      {
        modal === 'options' && (
          <ChatModal
            background={'none'}
            onClickOutSide={this.clickOutSide}
          >
            <ChatOptionsModal
              dock={this.props.dock}
              tab={this.props.tab}
              group={group}
              onOpenModal={this.showModal}
              users={users}/>
          </ChatModal>)

      }

      {
        modal === 'participants' && (
          <ChatModal
            onClickOutSide={this.clickOutSide}
          ><ChatParticipantsModal
            height={this.props.height}
            tab={this.props.tab}
            dock={this.props.dock}
            onClose={() => this.setState({modal: null})}
            users={users} group={group}/>
          </ChatModal>
        )
      }


    </Fragment>
  }

  getMessageHeight = () => {

    const {height} = this.props
    return height - 140
  }

  handleLoadMoreMessages = () => {

    const {messages, group} = this.props

    if (messages.length >= LIMIT) {
      const groupId = _.get(group, 'id')
      if (groupId) {

        this.setState({
          isLoadingMore: true
        }, () => {

          this.props.loadMessages(groupId, LIMIT, messages.length).then(() => {
            this.setState({
              isLoadingMore: false
            })

          }).catch((e) => {

            this.setState({
              isLoadingMore: false
            })

          })
        })
      }
    }
  }

  render () {

    const {dock, group, users, messages, active, avatar, unread, isNew} = this.props

    let isOpen = true
    const tab = _.get(this.props, 'tab')

    if (dock && !_.get(tab, 'open')) {
      isOpen = false
    }

    return (
      <Container className={'chat-container'}>
        <ChatHeader
          dock={dock}
          isNew={isNew}
          avatar={avatar}
          onClick={() => this.activeChat()}
          active={active}
          onOpenModal={this.showModal}
          onClose={() => {
            if (dock && this.props.tab) {
              this.props.closeChat(this.props.tab.id)
            }
          }}
          onToggle={() => {
            if (dock && this.props.tab) {
              this.props.toggleChat(this.props.tab.id, !isOpen)
            }
          }} title={_.get(group, 'title', '')}
          unread={unread}
          users={users}
          open={isOpen}/>

        {isNew ? (
          <CreateSingleChat
            tab={tab}
            dock={dock}
            hide={!isOpen}
            height={dock ? '450px' : `${this.props.height - 190}px`}/>
        ) : (
          <ChatMessages
            onClick={() => this.activeChat()}
            hide={!isOpen} className={'chat-messages'}>
            {
              this.renderModal()
            }
            <Messages
              isLoadingMore={this.state.isLoadingMore}
              onLoadMore={this.handleLoadMoreMessages}
              onEdit={this.handleOnEditMessage}
              dock={dock}
              height={dock ? 500 : this.getMessageHeight()}
              hasFile={!!this.state.files.length}
              messages={messages}/>
          </ChatMessages>
        )}

        {isOpen && (
          <Composer
            edit={this.state.edit}
            isNew={isNew}
            onOpenModal={this.showModal}
            onRemoveFile={this.onRemoveFile}
            onAddFiles={(files) => {
              this.onAddFiles(files)
            }}
            files={this.state.files}
            emoji={this.state.emoji}
            onClick={() => {
              this.activeChat()
            }}
            onSend={this.send}/>
        )}

      </Container>
    )
  }
}

const mapStateToProps = (state, props) => ({
  users: getGroupUsers(state, props),
  messages: getGroupMessages(state, props),
  active: props.dock && _.get(state.chat.active, 'id') === _.get(props, 'tab.id'),
  avatar: _.get(state.group.find((g) => g.id === props.group.id), 'avatar', ''),
  currentUserId: _.get(state.app.user, 'id', null),
  unread: getGroupUnreadCount(state, _.get(props, 'group.id', null))
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadMessages,
  toggleChat,
  closeChat,
  sendMessage,
  setActiveChat,
  updateMessage
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Chat)