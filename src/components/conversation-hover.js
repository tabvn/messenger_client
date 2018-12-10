import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`
  width: 200px;
  max-height: 450px;
  padding-right: 10px;
  background: none;
  border: 0 none;
  box-shadow: none;
  .arrow_box {
    position: relative;
    background: #fff;
    border: 1px solid #FFF;
    box-shadow:0 1px 3px 0 rgba(0,0,0,0.3);
    border-radius: 5px;
  }
  .arrow_box:after, .arrow_box:before {
    left: 100%;
    top: 20px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  
  .arrow_box:after {
    border-color: rgba(255, 255, 255, 0);
    border-left-color: #fff;
    border-width: 5px;
    margin-top: -5px;
  }
  .arrow_box:before {
    border-color: rgba(255, 255, 255, 0);
    border-left-color: #FFF;
    border-width: 6px;
    margin-top: -6px;
  }

`

const User = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 15px;
  
  &:hover{
    background: #ebebeb;
  }
 
  .u-user-avatar{
    position: relative;
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
    background: #0096e3;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    i{
      color: #FFF;
    }
    img{
      width: 20px;
      height: 20px;
      max-width: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .u-user-name{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 5px;
    flex-grow: 1;
    font-size: 15px;
    font-weight: 300;
    color: #000000;
  }
    
`

const List = styled.div`

`

export default class ConversationHover extends React.Component {

  render () {

    return (
      <Container className={'conversation-hover'}>

        <div className={'arrow_box'}>
          <List className={'user-list'}>
            {
              this.props.users.map((user, key) => {

                const avatar = _.get(user, 'avatar', null)
                const name = `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`

                return (
                  <User key={key}>
                    <div className={'u-user-avatar'}>
                      {avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon'}>person_outline</i>}
                    </div>
                    <div className={'u-user-name'}>{name}</div>
                  </User>)
              })
            }
          </List>
        </div>

      </Container>
    )
  }
}