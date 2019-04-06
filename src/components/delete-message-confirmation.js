import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  border-radius: 8px;
  padding: 8px;
  background: #12416a;
  .confirm-message{
    color: #FFF;
  }
  .confirm-buttons{
    margin-top: 5px;
    display: flex;
    justify-content: center;
    button{
      margin: 5px;
    }
  }
`

const Button = styled.button`
  cursor: pointer;
  background: #FFF;
  padding: 8px 18px;
  color: rgba(28,58,91,1);
  font-weight: 700;
  font-size: 16px;
  outline: 0 none;
  margin: 0;
  border: 0 none;
  text-align: center;
  border-radius: 5px;
  
  &.confirm-btn-primary{
    background: #2397e8;
    color: #FFF;
  }
  

`

export default class DeleteMessageConfirmation extends React.Component {

  render() {
    const {onCancel, onDelete} = this.props
    return (
        <Container className={'delete-message-confirmation'}>
          <div className={'confirm-message'}>Are you sure you want to delete
            this message?
          </div>
          <div className={'confirm-buttons'}>
            <Button onClick={() => {
              if (onCancel) {
                onCancel()
              }
            }} className={'confirm-btn-cancel'}>Cancel</Button>
            <Button onClick={() => {
              if (onDelete) {
                onDelete()
              }
            }}
                    className={'confirm-btn-primary'}>Delete</Button>
          </div>
        </Container>
    )
  }

}