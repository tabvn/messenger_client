import React from 'react'
import styled from 'styled-components'

const Container = styled.div`

  position: relative;
  flex-grow: 1;
  display: flex;
  
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

export default class ModalLayout extends React.Component {

  render () {

    return (
      <Container className={'ar-messenger-modal-container'}>
        <Close onClick={() => {
          if (this.props.onClose) {
            this.props.onClose()
          }
        }} className={'close-modal'}><i className={'md-icon'}>close</i></Close>
        <Inner className={'block-group-user-modal-inner'}>
          {
            this.props.children
          }
        </Inner>
      </Container>
    )
  }
}
