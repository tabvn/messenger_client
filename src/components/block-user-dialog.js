import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 160px;
  background: #FFF;
  border-radius: 8px;
  position: relative;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Text = styled.div`
  font-size: 17px;
  text-align: center;

`

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  justify-content: center;
`

const Button = styled.button`
  border: 0 none;
  box-shadow:0px -1px 4px #e6e6e6;
  padding: 7px 20px;
  text-align: center;
  border-radius: 3px;
  outline: 0 none;
  margin: 0;
  cursor: pointer;
  &:focus,&:active{
    outline: 0 none;
  }
  background: #818181;
  color: #FFF;
  font-size: 15px;
  &.no{
    background: #2397e8;
    margin-left: 10px;
  }
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

export default class BlockUserDialog extends React.Component {

  onClose = (answer) => {

    if (this.props.onClose) {
      this.props.onClose(answer)
    }
  }

  render () {

    return (
      <Container className={'block-user-dialog'}>
        <Close
          onClick={() => this.onClose(false)}
          className={'close-dialog'}><i className={'md-icon'}>close</i></Close>
        <Text className={'block-user-message'}>Are you sure you want to block this user?</Text>
        <Buttons className={'block-user-actions'}>
          <Button onClick={() => {
            this.onClose(true)

          }} className={'yes'}>Yes</Button>
          <Button
            onClick={() => this.onClose(false)}
            className={'no'}>No</Button>
        </Buttons>
      </Container>)
  }
}