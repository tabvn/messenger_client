import React from 'react'
import CreateGroupHeader from './create-group-header'
import CreateGroupSearchUsers from './create-group-search-user'
import styled from 'styled-components'

const Actions = styled.div`
    padding: 20px 0  0 0;
    justify-content: flex-end;
    display: flex;
    position: absolute;
    right: 20px;
    bottom: 20px;
`

const Button = styled.button`
  cursor: pointer;
  background: #818181;
  padding: 8px 18px;
  color: #FFF;
  font-weight: 700;
  font-size: 16px;
  outline: 0 none;
  margin: 0;
  border: 0 none;
  text-align: center;
  border-radius: 5px;
  &:active,&:focus{
    outline: 0 none;
  }
  &.create{
    background: #2397e8;
    margin-left: 10px;
  }
  &:hover{
    opacity: 0.8;
  }
  &.disabled{
    background: rgba(0,0,0,0.1);;
  }
  
`

export default class CreateGroup extends React.Component {

  state = {
    name: '',
    avatar: '',
    users: []
  }

  render () {

    const {users} = this.state

    let allowSubmit = false

    if (users.length) {
      allowSubmit = true
    }
    return (
      <div className={'create-group'}>
        <CreateGroupHeader onChange={(e) => {
          this.setState({
            name: e.name,
            avatar: e.avatar,
          })
        }}/>
        <CreateGroupSearchUsers
          onChange={(users) => {
            this.setState({users: users})
          }}
        />
        <Actions className={'create-group-actions'}>
          <Button onClick={() => {
            if (this.props.onClose) {
              this.props.onClose()
            }
          }} className={'cancel'}>Cancel</Button>

          <Button
            onClick={() => {
              if (this.props.onCreate) {
                this.props.onCreate({

                  title: this.state.name,
                  avatar: this.state.avatar,
                  users: this.state.users
                })
              }
            }}
            disabled={!allowSubmit}
            className={`create ${allowSubmit ? 'enabled' : 'disabled'}`}>Create</Button>
        </Actions>
      </div>
    )
  }
}
