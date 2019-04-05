import React, {Fragment} from 'react';
import styled from 'styled-components';
import _ from 'lodash';

const Container = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;  
  padding-left: 5px;
  flex-grown: 1;
  color: #000000;
  font-size: 15px;
  font-weight: 500;
  span {
    color: #000000;
    font-size: 15px;
  }
  .conversation-title{
    text-overflow: ellipsis; 
    overflow: hidden; 
    white-space: nowrap;
    span{
      display: inline-block;
      &:after{
        content: ",";
        
      }
      &:last-child{
        &:after{
          content: "";
        }
      }
    }
    
  }
  .message-body{
    padding: 5px;
    color: #000000;
    font-weight: 100;
    font-size: 15px;
    overflow: hidden;
    max-height: 50px;
  }
`;

const Emoji = styled.span`
  vertical-align: middle;
  font-size: 15px;
  text-align: right;
  transition: -webkit-transform 60ms ease-out;
  transition: transform 60ms ease-out;
  transition: transform 60ms ease-out, -webkit-transform 60ms ease-out;
  transition-delay: 60ms;
  font-family: Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;

`;

export default class ConversationTitle extends React.Component {

  renderTitle() {
    const {users} = this.props;

    return (
        <Fragment>

          {
            users.map((user, index) => {
              return (
                  <span
                      key={index}
                      className={'conversation-member'}>
                {`${_.get(user, 'first_name', '')} ${_.get(user, 'last_name',
                    '')}`}</span>
              );
            })
          }
        </Fragment>
    );
  }

  renderMessage() {

    const {message} = this.props;

    const body = _.get(message, 'body', '');
    const attachments = _.get(message, 'attachments', []);
    const gif = _.get(message, 'gif', null);
    const attachmentCount = attachments.length;
    const isEmoji = _.get(message, 'emoji', false);

    return (
        <div className={'conversation-message'}>
          <div className={'message-body'}>
            {isEmoji ? <Emoji>{body}</Emoji> : body}
            {!body && attachmentCount && attachmentCount > 0 ?
                ` ${attachmentCount} attachments` :
                null}
            {gif ? ' GIF' : null}
          </div>
        </div>
    );
  }

  render() {

    const {title} = this.props;

    return (

        <Container className={'conversation-header'}>
          <div className={'conversation-title'}>
            {title && title !== '' ? title : this.renderTitle()}
          </div>
          {this.renderMessage()}
        </Container>
    );
  }
}