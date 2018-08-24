import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`

  display: flex;
  flex-direction: row;
  margin: 10px 0;

`

const Icon = styled.div`
  background: #12416a;
  color: #FFF;
  display: flex;
  align-items: center;
  padding: 5px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  height: 42px;
  i{
    color: #FFF;
    width: 30px;
  }
`

const Ext = styled.div`
  color: ##c4c4c4;
  font-size: 12px;
  text-transform: uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
`

const FileInfo = styled.div`
  flex-grow: 1;
  padding-left: 5px;
  border: 1px solid rgba(0,0,0,0.08);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`

const Filename = styled.div`
  color: #000;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 200px;

`

export default class MessageFile extends React.Component {

  getExt = () => {
    const {file} = this.props

    const s = _.split(file.name, '.')

    return s[s.length - 1]
  }

  render () {
    const {file} = this.props
    return (
      <Container className={'message-file'}>
        <Icon className={'file-icon'}><i className={'md-icon'}>notes</i></Icon>
        <FileInfo>
          <Ext>{this.getExt()}</Ext>
          <Filename className={'file-icon'}>{file.name}</Filename>
        </FileInfo>
      </Container>
    )
  }
}