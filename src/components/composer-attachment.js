import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`
  display: inline-block;
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 8px;
  height: 44px;
  width: 180px;
  margin: 0 5px;
`

const Inner = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  position: relative;
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
  max-width: 115px;
`

const FileInfo = styled.div`
  flex-grow: 1;
  padding-left: 5px;
`

const FileName = styled.div`
  color: #000;
  font-size: 12px;
  max-width: 115px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

`

const Close = styled.div`
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 3px;
  width: 15px;
  height: 15px;
  display: flex;
  background: #c4c4c4;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  i{
    font-size: 14px;
    color: #FFF; 
  }
`

export default class ComposerAttachment extends React.Component {

  getExt = () => {
    const {file} = this.props

    const s = _.split(file.name, '.')

    return s[s.length - 1]
  }

  render () {
    const {file} = this.props


    return (
      <Container className={'attachment'}>
        <Inner className={'attachment-inner'}>
          <Icon className={'icon'}><i className={'md-icon'}>notes</i></Icon>
          <FileInfo className={'file-info'}>
            <Ext className={'file-ext'}>{this.getExt()}</Ext>
            <FileName className={'filename'}>{file.name}</FileName>
          </FileInfo>
          <Close
            onClick={() => {
              if (this.props.onRemove) {
                this.props.onRemove(file)
              }
            }}
            className={'remove-attachment'}><i className={'md-icon'}>close</i></Close>
        </Inner>
      </Container>
    )
  }
}
