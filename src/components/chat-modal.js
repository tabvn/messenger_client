import React from 'react'
import styled from 'styled-components'
import onClickOutside from 'react-onclickoutside'
import PropTypes from 'prop-types'

const Container = styled.div`
  position: absolute;
  left: ${props => props.left};
  top: ${props => props.top};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
  z-index: 2;
  background: ${props => props.background};
  border-radius: 8px;
  display: flex;
  height: ${props => props.height};
  .modal-inner{
    display: flex;
    flex-grow: 1;
  }
`

const Overlay = styled.div`
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,0.78);
  
`

class ChatModal extends React.Component {

  handleClickOutside = evt => {
    if (this.props.onClickOutSide) {
      this.props.onClickOutSide(evt)
    }
  }

  render () {
    const {top, right, left, bottom, height, background} = this.props
    return (
      <div className={'chat-modal-container'}>
        <Overlay
          className={'chat-modal-overlay'}/>
        <Container
          background={background}
          top={top}
          right={right}
          bottom={bottom}
          left={left}
          height={height}
          className={'chat-modal'}>
          <div className={'modal-inner'}>
            {this.props.children}
          </div>
        </Container>
      </div>
    )
  }
}

ChatModal.defaultProps = {
  top: '20px',
  right: '10px',
  bottom: '20px',
  left: '10px',
  height: 'auto',
  background: '#FFF'
}

ChatModal.propTypes = {
  top: PropTypes.any,
  right: PropTypes.any,
  bottom: PropTypes.any,
  left: PropTypes.any,
  height: PropTypes.any,
  background: PropTypes.string,
  onClickOutSide: PropTypes.func,
}

export default onClickOutside(ChatModal)