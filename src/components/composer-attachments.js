import React from 'react'
import styled from 'styled-components'
import ComposerAttachment from './composer-attachment'

const Container = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
`

const Inner = styled.div`
  overflow: auto;
  white-space: nowrap;
`

export default class ComposerAttachments extends React.Component {

  render () {

    const {files} = this.props

    return (
      <Container className={'composer-attachments'}>
        <Inner className={'composer-attachments-inner'}>
          {files.map((file, index) => {
            return <ComposerAttachment
              onRemove={(file) => {
                if (this.props.onRemove) {
                  this.props.onRemove(file)
                }
              }}
              key={index} file={file}/>
          })}
        </Inner>
      </Container>
    )
  }
}