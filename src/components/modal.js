import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { closeModal, openModal } from '../redux/actions'

const Close = styled.button`
  border: 0 none;
  background: none;
  padding: 3px;
  outline: 0 none;
  cursor: pointer;
  &:focus,&:active{
    outline: 0 none;
  }
  i{
    color: #FFF;
    font-size: 24px;
  }
`

class Modal extends React.Component {

  componentDidUpdate (prevProps) {

    if (this.props.open !== prevProps.open) {
      this.handleOpenModal()
    }
  }

  handleOpenModal = () => {

    let {open, title, onClose, className, header} = this.props


    let closeButton = (<Close onClick={(e) => {
      if (onClose) {
        onClose(e)
      } else {
        this.props.closeModal()
      }

    }}><i className={'md-icon'}>close</i></Close>)

    if(!header){
      title = null
      closeButton = null
    }
    this.props.openModal(this.props.children, title, closeButton, open, onClose, className)

  }

  componentDidMount () {

    this.handleOpenModal()
  }

  render () {

    return null
  }
}

Modal.defaultProps = {
  header: true,
}

Modal.propTypes = {
  title: PropTypes.any,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  header: PropTypes.bool,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  openModal,
  closeModal

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Modal)