import React from 'react'
import styled from 'styled-components'
import MessageFile from './message-file'

const Container = styled.div`


`

export default class MessageFiles extends React.Component {

  render () {
    const {files} = this.props

    return (
      <Container className={'message-files'}>
        {files.map((file, index) => {
          return (<MessageFile key={index} file={file}/>)
        })}
      </Container>
    )
  }
}