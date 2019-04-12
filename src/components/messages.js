import React from 'react'
import styled, {keyframes} from 'styled-components'
import Message from './message'
import _ from 'lodash'
import UserTyping from './user-typing'
import NotificationMessage from './notification-message'

const Container = styled.div`
  flex-grow: 1;
  .inner{
    display: flex;
    flex-direction:column;
    overflow-y: auto;
    overflow-x: hidden;
    height: ${props => props.h}px;
    max-height: ${props => props.maxHeight};
    @media (max-width: 375px) {
      height: calc(100% - 200px);
    }
  }
  .no-message{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .no-message-icons{
      display: flex;
      flex-direction: row;
      justify-content: center;
      i{
        color: #c4c4c4;
        font-size: 36px;
      }
    }
  }
  .no-message-help{
    color: #b0bdc9;
    font-size: 21px;
  }
  .unread-notify-box{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      padding: 5px 8px;
      background: #f8c231;
      align-items: center;
    .unread-notify-box-inner{
      color: #484848;
      font-weight: 700;
      text-align: center;
      flex-grow: 1;
    }
    .close-unread-notify{
      cursor: pointer;
      padding: 3px 5px;
      i{
      font-size: 18px;
      }
    }
  }
`

const messengerLoading1 = keyframes`
    from{
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
`

const messengerLoading2 = keyframes`
    from{
      transform: translate(0, 0);
    }
    to {
      transform: translate(19px, 0);
    }
`

const messengerLoading3 = keyframes`
    from{
       transform: scale(1);
    }
    to {
      transform: scale(0);
    }
`

const Loading = styled.div`
    height: 64px;
    width: 100%;
    display: flex;
    justify-content: center;
    .messenger-loading {
      display: inline-block;
      position: relative;
      width: 64px;
      height: 64px;
      .messenger-loading-circle{
        position: absolute;
        top: 27px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #959595;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
  
      }
  }
 
  .messenger-loading div:nth-child(1) {
    left: 6px;
    animation: ${messengerLoading1} 0.6s infinite;
  }
  .messenger-loading div:nth-child(2) {
    left: 6px;
    animation: ${messengerLoading2} 0.6s infinite;
  }
  .messenger-loading div:nth-child(3) {
    left: 26px;
    animation: ${messengerLoading2} 0.6s infinite;
  }
  .messenger-loading div:nth-child(4) {
    left: 45px;
    animation: ${messengerLoading3} 0.6s infinite;
  }
  
`

let sessionScrollTop = null

export default class Messages extends React.Component {

  state = {
    autoScroll: true,
    showUnreadNotify: false,
  }

  scrollToBottom = () => {
    if (this.ref) {
      this.ref.scrollTop = this.ref.scrollHeight
    }
  }

  componentDidMount() {
    this.scrollToBottom()

    _.delay(() => {
      this.scrollToBottom()
    }, 2000)

  }

  componentDidUpdate(prevProps) {
    const {isLoadingMore, active} = this.props

    if (!active && this.props.unread > prevProps.unread) {
      this.setState({
        showUnreadNotify: this.props.unread,
      })
    }
    if (active && this.props.messages.length > prevProps.messages.length ||
        this.props.userTypings.length > prevProps.userTypings.length ||
        this.props.notifications.length > prevProps.notifications.length) {
      if (isLoadingMore) {

        if (this.ref && sessionScrollTop) {
          this.ref.scrollTop = this.ref.scrollHeight - sessionScrollTop
        }

      } else {
        this.scrollToBottom()
      }

    }
  }

  renderMessages = () => {

    const {messages, dock} = this.props

    let author = null

    let rows = []

    messages.map((message, index) => {

      let item = null

      if (_.get(message, 'type') === 'notification') {

        item = <NotificationMessage message={message}/>

      } else {
        item = <Message key={index} onEdit={(message) => {
          if (this.props.onEdit) {
            this.props.onEdit(message)
          }

        }} dock={dock} hideAvatar={author === message.user_id} key={index}
                        message={message}/>
      }

      rows.push(item)

      author = message.user_id

      return message
    })

    return rows
  }

  renderEmpty = () => {

    return (
        <div className={'no-message'}>

          <div className={'no-message-icons'}>
            <i className={'md-icon'}>tag_faces</i>
            <i className={'md-icon'}>tag_faces</i>
          </div>
          <div className={'no-message-help'}>
            start your conversation here
          </div>
        </div>
    )
  }

  handleOnScroll = (event) => {

    const {showUnreadNotify} = this.state
    const scrollViewOffsetY = _.get(event.target, 'scrollTop', 0)
    const scrollViewFrameHeight = _.get(event.target, 'clientHeight', 0)

    const sum = scrollViewOffsetY + scrollViewFrameHeight

    if (sum <= scrollViewFrameHeight) {
      // Reached top
      sessionScrollTop = this.ref.scrollHeight

      if (this.props.onLoadMore) {
        this.props.onLoadMore()
      }
    }

    if (sum >= _.get(event.target, 'scrollHeight', 0) - 10) {
      // scroll to the bottom
      if (showUnreadNotify) {
        this.setState({
          showUnreadNotify: 0,
        })
      }

    }

  }

  getMaxHeight() {

    const {dock} = this.props

    if (dock) {
      const windowHeight = window.innerHeight
      const h = windowHeight - (74 + 58)

      return `${h}px`
    }

    return '100%'
  }

  render() {

    const {messages, hasFile, height, userTypings, notifications} = this.props
    const {showUnreadNotify} = this.state

    let h = height

    if (hasFile) {
      h = h - 44
    }
    const maxHeight = this.getMaxHeight()
    return (
        <Container
            maxHeight={maxHeight}
            h={h}
            onClick={(e) => {
              if (this.props.onClick) {
                this.props.onClick(e)
              }
            }}
            className={'ar-messages'}>
          <div onScroll={this.handleOnScroll} ref={(ref) => this.ref = ref}
               className={'inner'}>
            {this.props.isLoadingMore ? <Loading>
              <div className={'messenger-loading'}>
                <div className={'messenger-loading-circle'}/>
                <div className={'messenger-loading-circle'}/>
                <div className={'messenger-loading-circle'}/>
                <div className={'messenger-loading-circle'}/>
              </div>
            </Loading> : null}
            {
              messages.length ? this.renderMessages() : this.renderEmpty()
            }

            {
              userTypings.length ? userTypings.map((user, key) => {

                return <UserTyping key={key} user={user}/>
              }) : null
            }

            {showUnreadNotify > 0 ? (
                <div
                    className={'unread-notify-box'}>
                  <div
                      className={'unread-notify-box-inner'}> {`${showUnreadNotify} new/unread messages`}</div>
                  <div onClick={() => {
                    this.setState({
                      showUnreadNotify: 0,
                    })
                  }}
                       className={'close-unread-notify'}><i
                      className={'md-icon'}>close</i></div>
                </div>
            ) : null}
          </div>


        </Container>
    )
  }
}