import React, { Fragment } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Container = styled.div`
  border-radius: 8px;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),0px 24px 38px 3px rgba(0, 0, 0, 0.14),0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  /* Probably need media queries here */
  width: 300px;
  max-width: 100%;
  height: 300px;
  max-height: 100%;
  position: fixed;
  z-index: 100;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  @media(min-width: 768px){
    width: 620px;
    height: 500px;
  }
  z-index: 2000001;
`

const Overlay = styled.div`

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2000000;
`

const Header = styled.div`
  background: #818181;
  color: #484848;
  display: flex;
  padding: 15px 20px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`
const Title = styled.div`
  font-size: 25px;
  color: #FFF;
  font-weight: 300;
  flex-grow: 1;
`

const Inner = styled.div`
  padding: 20px;
  background: #FFF;
  flex-grow: 1;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  position: relative;
`

class AppModal extends React.Component {

  render () {

    const {modal} = this.props

    const component = _.get(modal, 'component', null)
    const title = _.get(modal, 'title', null)
    const close = _.get(modal, 'close', null)
    const open = _.get(modal, 'open', false)

    return (
      modal && open ? (
        <Fragment>
          <Overlay className="modal-overlay"/>
          <Container className={'app-modal'}>
            {title || close ? (
              <Header className={'modal-header'}>
                <Title>{title}</Title>
                {close}
              </Header>
            ) : null}
            <Inner className={'app-modal-inner'}>
              {component}
            </Inner>
          </Container>
        </Fragment>

      ) : null
    )
  }
}

const mapStateToProps = (state) => ({
  modal: state.modal,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AppModal)