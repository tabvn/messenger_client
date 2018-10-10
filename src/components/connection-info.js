import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: #FFF;
  display: flex;
  align-items: center;
  padding: 10px;
  i{
    margin-right: 5px;
    color: #b0b0b0;
    font-size: 24px;
  }
  font-size: 17px;
  color: #b0b0b0;
  z-index:2;

`

class ConnectionInfo extends React.Component {

  state = {
    status: true
  }

  componentDidMount () {

    this.networkInfoEvent = this.props.networkInfo((status) => {

      this.setState({
        status: status
      })
    })
  }

  componentWillUnmount () {

    if (this.networkInfoEvent) {
      this.networkInfoEvent.remove()
    }
  }

  render () {
    return (
      !this.state.status ? (
        <Container className={'network-info'}>
          <i className={'md-icon'}>error_outline</i>Connection lost. Messaging unavailable
        </Container>
      ) : null
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  networkInfo: (cb) => {
    return (dispatch, getState, {service}) => {
      return service.subScribeNetworkInfo(cb)
    }
  }
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionInfo)
