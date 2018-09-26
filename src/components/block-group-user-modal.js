import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { blockUser } from '../redux/actions'
import {connect} from 'react-redux'

const Container = styled.div`

  position: relative;
  flex-grow: 1;
  display: flex;
  
`

const Title = styled.div`
  font-size: 20px;
  color: #484848;
`

const Close = styled.div`
  cursor: pointer;
  border: 0 none;
  outline: 0 none;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 10px;
  top: 10px;
  color: #adadad;
  i{
    color: #adadad;
  }
`

const Inner = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
   padding: 20px 10px 5px 10px;

`
const Users = styled.div`

    overflow-y: auto;
    overflow-x: hidden;
    height: ${props => props.height}px;
`

const User = styled.div`
  cursor: pointer;
  padding: 8px 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  &:hover{
    background: #efefef;
  }
  .search-user-avatar{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: #2397e8;
    color: #FFF;
    border-radius: 50%;
    img{
      width: 40px;
      height: 40px;
      max-width: 100%;
      border-radius: 50%;
    }
    i{
      color: #FFF;
    }
  }
  .search-user-name{
    padding-left: 5px;
    text-align: left;
    flex-grow: 1;
    color: #484848;
    font-size: 16px;
    font-weight: 400;
      
  }
  .is-selected{
    color: #2397e8;
    i{
      color: #2397e8;
    }
  }
  .un-selected{
    color: #484848;
    i{
      color: #484848;
    }
  }
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  padding: 10px;
`
const SelectAll = styled.button`
  flex-grow:1;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  background: none;
  border: 0 none;
  &:active,&:focus{
    outline: 0 none;
  }
  padding: 0;
  color: #484848;
  font-size: 18px;
  
  &.is-selected{
    i{
      color: #2397e8;
  
    }
  }
`

const Button = styled.button`
  background: #818181;
  color: #FFF;
  fonts-size: 15px;
  font-weight: 700;
  padding: 10px 18px;
  text-align: center;
  margin:0;
  outline: 0 none;
  border: 0 none;
  border-radius: 5px;
  cursor: pointer;
  &:active,&:focus{
    outline: 0 none;
  }
  &.btn-color{
    background: #2397e8;
    margin-left: 10px;
  }
  &:hover{
    opacity: 0.88;
  }
`

class BlockGroupUserModal extends React.Component {

  state = {
    selected: {},
    all: false,
  }
  onSelect = (user, isSelect = false) => {
    const {users} = this.props

    let isCheckedAll = true
    let select = this.state.selected

    select[user.id] = isSelect

    for (let i = 0; i < users.length; i++) {
      if (!_.get(select, users[i].id, false)) {
        isCheckedAll = false
      }
    }

    this.setState({
      selected: {
        ...this.state.selected,
        [user.id]: isSelect,

      },
      all: isCheckedAll,
    })
  }

  onCancel = () => {

    if (this.props.onClose) {
      this.props.onClose()
    }
  }
  onSave = () => {

    // handle block user

    _.each(this.state.selected, (v,userId) => {

      this.props.blockUser(userId)
    });

    if (this.props.onClose) {
      this.props.onClose()
    }
  }

  render () {
    const {users, dock, height} = this.props

    let checkList = {}
    users.forEach((u) => {
      checkList[u.id] = true
    })

    let h = height - 350

    if (dock) {
      h = 270
    }


    return (
      <Container className={'block-group-user-modal'}>
        <Close onClick={() => {
          if (this.props.onClose) {
            this.props.onClose()
          }
        }} className={'close-modal'}><i className={'md-icon'}>close</i></Close>
        <Inner className={'block-group-user-modal-inner'}>
          <Title>Select users to block:</Title>
          <Users
            height={h}
            className={'user-list'}>
            {
              users.map((user, index) => {

                const avatar = _.get(user, 'avatar', null)
                const name = `${_.get(user, 'first_name', '')} ${_.get(user, 'last_name', '')}`
                const isSelected = _.get(this.state.selected, user.id, false)

                return <User
                  onClick={() => {
                    this.onSelect(user, !isSelected)
                  }}

                  key={index} className={'user-result'}>
                  <div className={'search-user-avatar'}>
                    {avatar ? <img src={avatar} alt={''}/> : <i className={'md-icon'}>person_outline</i>}
                  </div>
                  <div className={'search-user-name'}>{name}</div>
                  {isSelected ? <div className={'is-selected'}>
                    <i className={'md-icon'}>check_circle</i>
                  </div> : <div className={'un-selected'}>
                    <i className={'md-icon'}>radio_button_unchecked</i>
                  </div>}

                </User>
              })
            }
          </Users>

          <Footer className={'block-group-user-footer'}>
            <SelectAll
              onClick={() => {
                const checked = !this.state.all
                this.setState({
                  all: checked,
                  selected: !checked ? {} : checkList
                })
              }}
              className={`select-all-action ${this.state.all ? 'is-selected' : 'is-not-selected'}`}>
              <i className={'md-icon'}>{this.state.all ? 'check_circle' : 'radio_button_unchecked'}</i> select all
            </SelectAll>
            <Button onClick={this.onCancel} className={'btn-cancel'}>Cancel</Button>
            <Button onClick={this.onSave} className={'btn-color'}>Save</Button>

          </Footer>
        </Inner>
      </Container>
    )
  }
}


const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  blockUser,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BlockGroupUserModal)