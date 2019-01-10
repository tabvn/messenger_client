import { combineReducers } from 'redux'
import user from './user'
import app from './app'
import popover from './popover'
import sidebar from './sidebar'
import userStatus from './user-status'
import group from './group'
import friend from './friend'
import message from './message'
import error from './error'
import friendGroupOpen from './friend-group-open'
import search from './search'
import chat from './chat'
import attachmentModal from './attachment-modal'
import modal from './modal'
import gif from './gif'
import emoji from './emoji'
import inbox from './inbox'
import sound from './sound'
import call from './call'
import blocked from './blocked'
import typing from './typing'

export default combineReducers({
  app,
  sound,
  popover,
  sidebar,
  userStatus,
  user,
  friend,
  friendGroupOpen,
  group,
  message,
  error,
  search,
  chat,
  attachmentModal,
  modal,
  gif,
  emoji,
  inbox,
  call,
  blocked,
  typing,
})
