import React, {Fragment} from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import ChatHeader from './chat-header'
import {getGroupUnreadCount, getGroupUsers} from '../redux/selector/group'
import Messages from './messages'
import {getGroupMessages} from '../redux/selector/message'

import {
  closeChat,
  loadMessages,
  sendMessage,
  setActiveChat,
  toggleChat,
  updateMessage,
  startCall,
  userIsTyping,
  userIsEndTyping,
  removeActiveChat,
} from '../redux/actions'
import Composer from './composer'
import {maxUploadSize} from '../config'
import ChatModal from './chat-modal'
import GifModal from './gif-modal'
import EmojiModal from './emoji-modal'
import ChatOptionsModal from './chat-options-modal'
import ChatParticipantsModal from './chat-participants-modal'
import CreateSingleChat from './create-single-chat'
import ChatReportModal from './chat-report-modal'
import BlockGroupUserModal from './block-group-user-modal'
import GroupUserRemoveModal from './group-user-removed-modal'
import {ADD_GROUP_NOTIFICATION, EVENT_GROUP_USER_REMOVED} from '../redux/types'
import InviteNotify from './invite-notify'
import ClickOutside from './click-outside'

const Container = styled.div`
  flex-grow: 1;
  position: relative;
  .chat-messages{
    overflow: hidden;
  }
  .ar-file-drop{
    border: 2px dashed #c4c4c4;
    border-radius: 8px;
    background: rgba(255,255,255,0.9);
    padding: 5px;
    position: absolute;
    top: 80px;
    bottom: 80px;
    right: 10px;
    left: 10px;
    z-index:1000;
    display: flex;
    .ar-file-drop-inner{
      font-size: 15px;
      color: #000;
      i{
        color: #f8c231;
        font-size: 40px;
      }
      display: flex;
      align-items: center;
      flex-grow:1;
      justify-content:center;
      flex-direction: column;
      .ar-text-center{
        color: #000;
        font-size: 18px;
        font-weight: 400;
      }
    }
  }
`

const ChatMessages = styled.div`
  display: ${props => props.hide ? 'none' : 'block'};
  position: relative;
  background: #FFF;
`

const LIMIT = 50
let lastMessage = null
let targetEvent = null

class Chat extends React.Component {

  state = {
    files: [],
    gif: '',
    modal: '',
    emoji: null,
    edit: null,
    isLoadingMore: false,
    removeBy: null,
    fileIsDrop: false,
  }

  dragCounter = 0
  handleOnTyping = () => {

    const {currentUserId, group} = this.props

    if (_.get(group, 'id')) {

      this.props.userIsTyping(currentUserId, group.id, true)
    }

  }
  handleOnEndTyping = () => {
    const {currentUserId, group} = this.props
    if (_.get(group, 'id')) {

      this.props.userIsEndTyping(currentUserId, group.id, true)
    }
  }

  _onDragEnter(e) {
    e.stopPropagation()
    e.preventDefault()

    this.dragCounter++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({fileIsDrop: true})
    }

    //return false
  }

  _onDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    // return false
  }

  _onDragLeave(e) {

    this.dragCounter--

    e.stopPropagation()
    e.preventDefault()

    if (this.dragCounter === 0) {
      this.setState({
        fileIsDrop: false,
      })
    }
    //return false
  }

  _onDrop(e) {
    e.preventDefault()

    let files = e.dataTransfer.files
    // Upload files

    this.setState({fileIsDrop: false})
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.onAddFiles(files)
      this.dragCounter = 0
    }

    // return false
  }

  componentDidMount() {

    document.addEventListener('mouseup', this._onDragLeave.bind(this))

    this.loadMessages()

    this._removedEvent = this.props.subscribeRemoved((info) => {
      this.setState({
        modal: 'group_user_removed',
        removeBy: info,
      })
    })

  }

  componentWillUnmount() {
    if (this._removedEvent) {
      this._removedEvent.remove()
    }

    document.removeEventListener('mouseup', this._onDragLeave.bind(this))
  }

  loadMessages = () => {
    const {group} = this.props

    const groupId = _.get(group, 'id')
    if (groupId) {
      this.props.loadMessages(groupId, LIMIT, 0)
    }
  }

  componentDidUpdate(prevProps) {

    if (this.props.messages.length < 2 && _.get(this.props.group, 'id') &&
        _.get(this.props, 'group.id') !== _.get(prevProps, 'group.id')
    ) {
      this.loadMessages()
    }
  }

  handleOnEditMessage = (message) => {

    this.setState({
      edit: message,
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

  removeActiveChat = () => {

    const {active} = this.props

    if (active && this.props.dock && this.props.tab) {
      this.props.removeActiveChat()
    }
  }

  showModal = (name, e) => {

    targetEvent = e ? e.target.id : null

    this.setState({
      modal: this.state.modal === name ? null : name,
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

      this.props.sendMessage(msg, group, userIds).then((msg) => {
        lastMessage = msg
      })

    }

    this.setState({
      gif: '',
      files: [],
      edit: null,
    })

    this.handleOnEndTyping()
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
      files: _files,
    })

  }

  onRemoveFile = (file) => {

    let files = this.state.files.filter((f) => f.name !== file.name)
    this.setState({
      files: files,
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
                clickedTarget={targetEvent}
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
                clickedTarget={targetEvent}
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
                clickedTarget={targetEvent}
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
        modal === 'block' && (
            <ChatModal
                onClickOutSide={this.clickOutSide}
            >
              <BlockGroupUserModal
                  height={height}
                  dock={dock}
                  users={users}
                  onClose={() => this.setState({modal: null})}
              />
            </ChatModal>

        )
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

      {
        modal === 'flag' && (
            <ChatModal onClickOutSide={this.clickOutSide}>
              <ChatReportModal
                  onClose={() => {
                    this.setState({
                      modal: null,
                    })
                  }}
                  height={height}
                  users={users}
                  dock={dock}/>
            </ChatModal>
        )
      }

      {
        modal === 'group_user_removed' && (

            <ChatModal onClickOutSide={this.clickOutSide}>
              <GroupUserRemoveModal
                  removeBy={this.state.removeBy}
                  onClose={() => {
                    this.setState({
                      modal: null,
                      removeBy: null,
                    })
                  }}
                  height={height}
                  users={users}
                  dock={dock}/>
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
          isLoadingMore: true,
        }, () => {

          this.props.loadMessages(groupId, LIMIT, messages.length).then(() => {
            this.setState({
              isLoadingMore: false,
            })

          }).catch((e) => {

            this.setState({
              isLoadingMore: false,
            })

          })
        })
      }
    }
  }

  handleStartVideoCall = () => {
    this.props.startCall(this.props.users, this.props.group)
  }

  onToggle = () => {
    const {dock} = this.props

    let isOpen = true
    const tab = _.get(this.props, 'tab')

    if (dock && !_.get(tab, 'open')) {
      isOpen = false
    }

    if (dock && this.props.tab) {
      this.props.toggleChat(this.props.tab.id, !isOpen)
    }
  }

  render() {

    const {dock, group, users, messages, active, avatar, unread, isNew, userTypings, notifications} = this.props

    let isOpen = true
    const tab = _.get(this.props, 'tab')

    if (dock && window.innerWidth > 375 && !_.get(tab, 'open')) {
      isOpen = false
    }

    let listTypingUsers = []

    userTypings.forEach((item) => {

      if (users.length) {
        const user = users.find((u) => u.id === item.userId)
        if (user) {
          listTypingUsers.push(user)
        }
      }
    })

    return (
        <ClickOutside onClickOutside={this.removeActiveChat}><Container
            onDrop={this._onDrop.bind(this)}
            onDragEnter={this._onDragEnter.bind(this)}
            onDragOver={this._onDragOver.bind(this)}
            onDragLeave={this._onDragLeave.bind(this)}
            id={'ar-file-drop-zone'}
            className={'chat-container'}>
          <InviteNotify chat={tab} groupId={_.get(group, 'id')} users={users}
                        currentUserId={this.props.currentUserId}/>
          <div id={'ar-file-drop'}
               style={{display: this.state.fileIsDrop ? 'flex' : 'none'}}
               className={'ar-file-drop'}>
            <div className={'ar-file-drop-inner'}>
              <div><i className={'md-icon'}>insert_drive_file</i></div>
              <div className={'ar-text-center'}>drop to attach files</div>
            </div>
          </div>
          <ChatHeader
              onHeaderClick={this.onToggle}
              dock={dock}
              isNew={isNew}
              avatar={avatar}
              onClick={() => this.activeChat()}
              active={active}
              onOpenModal={this.showModal}
              onVideoCall={this.handleStartVideoCall}
              onClose={() => {
                if (dock && this.props.tab) {
                  this.props.closeChat(this.props.tab.id)
                }
              }}
              onToggle={this.onToggle} title={_.get(group, 'title', '')}
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
                    unread={unread}
                    active={active}
                    isLoadingMore={this.state.isLoadingMore}
                    onLoadMore={this.handleLoadMoreMessages}
                    onEdit={this.handleOnEditMessage}
                    dock={dock}
                    height={dock ? 500 : this.getMessageHeight()}
                    hasFile={!!this.state.files.length}
                    userTypings={listTypingUsers}
                    notifications={notifications}
                    messages={messages}/>
              </ChatMessages>
          )}

          {isOpen && (
              <Composer
                  onTyping={this.handleOnTyping}
                  onEndTyping={this.handleOnEndTyping}
                  onPressArrowUp={() => {
                    if (lastMessage) {
                      if (lastMessage.body) {
                        this.handleOnEditMessage(lastMessage)
                      }

                    }
                  }}
                  onClearEmoji={() => {
                    this.setState({
                      emoji: null,
                    })
                  }}
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
        </ClickOutside>
    )
  }
}

const mapStateToProps = (state, props) => ({
  users: getGroupUsers(state, props),
  messages: getGroupMessages(state, props),
  active: props.dock && _.get(state.chat.active, 'id') ===
      _.get(props, 'tab.id'),
  avatar: _.get(state.group.find((g) => g.id === _.get(props.group, 'id')),
      'avatar', ''),
  currentUserId: _.get(state.app.user, 'id', null),
  unread: getGroupUnreadCount(state, _.get(props, 'group.id', null)),
  userTypings: state.typing.filter(
      (i) => i.groupId === _.get(props, 'group.id')).valueSeq(),
  notifications: state.groupNotification.filter(
      (n) => n.group_id === props.group.id),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  loadMessages,
  toggleChat,
  closeChat,
  sendMessage,
  setActiveChat,
  updateMessage,
  startCall,
  userIsEndTyping,
  userIsTyping,
  removeActiveChat,
  subscribeRemoved: (cb) => {
    return (dispatch, getState, {service, event}) => {
      return event.subscribe(EVENT_GROUP_USER_REMOVED, cb)
    }
  },
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Chat)