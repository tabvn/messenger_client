import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background: #0096e3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 10px;
`

const Button = styled.button`
  cursor: pointer;
  border: 0 none;
  background: none;
  &.call-end{
    background: rgba(237,97,91,1);
    color: #FFF;
    padding: 5px;
    width: 40px;
    border-radius: 50%;
    height: 40px;
    i{
      color: #FFF;
    }
  }
`

export default class CallActions extends React.Component {

  render () {
    return (
      <Container>
        <Button
          className={'call-end'}
          onClick={() => {

            if (this.props.onEnd) {
              this.props.onEnd()
            }
          }}>
          <i className={'md-icon'}>call_end</i>
        </Button>
      </Container>
    )
  }
}