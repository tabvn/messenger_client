import React from 'react'
import styled from 'styled-components'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Container = styled.div`
  
 
`

class Conversations extends React.Component {

  render () {

    console.log('groups', this.props.groups)

    return (
      <Container className={'conversations'}>

      </Container>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Conversations)