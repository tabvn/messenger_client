import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { api } from '../config'

const Container = styled.div`

`

const ImageAttachment = styled.div`
  position: relative;
  max-height: 260px;
  max-width: 300px;
  margin: 10px 0;
  cursor: pointer;
  img{
    max-width: 100%;
    height: auto;
    max-height: 260px;
    border-radius: 8px;
  }
  .attachment-overlay{
    z-index: 1;
    visibility: hidden;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: absolute;
    top: 0;
    border-radius: 8px;
    display: flex;
    color: #FFF;
    justify-content: center;
    align-items: center;
    i{
      color: #FFF;
      font-size: 36px;
    }
  }
  &:hover{
    .attachment-overlay{
      visibility: visible;
    }
  }
`

const File = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  .download-attachment{
    text-decoration: none;
    cursor: pointer;
    position: absolute;
    right: 5px;
    top: 5px;
    padding: 3px;
    width: 25px;
    height: 25px;
    display: block;
    text-align: center;
    &:hover{
      outline: 0 none;
      text-decoration: none;
    }
    i{
      font-size: 24px;
      color: #0096e3; 
    }
  }

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
  margin: 2px 0;
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

export default class MessageAttachment extends React.Component {

  attachmentUrl = (name) => {
    return `${api}/attachment?name=${name}`
  }

  getUrl = () => {

    const {attachment} = this.props

    return `${api}/attachment?name=${attachment.name}`
  }
  renderImage = () => {
    const {attachment} = this.props

    return (
      <ImageAttachment
        onClick={() => {
          if (this.props.onClick) {
            this.props.onClick(attachment)
          }
        }}
        className={'message-attachment-image'}>
        <img
          src={this.attachmentUrl(attachment.name)} alt={''}/>
        <div className={'attachment-overlay'}><i className={'md-icon'}>zoom_in</i></div>
      </ImageAttachment>
    )
  }

  getExt = () => {
    const {attachment} = this.props

    const s = _.split(attachment.original, '.')

    return s[s.length - 1]
  }

  renderFile = () => {

    const {attachment} = this.props

    return (
      <File title={attachment.original} className={'attachment-file'}>
        <Icon className={'file-icon'}><i className={'md-icon'}>notes</i></Icon>
        <FileInfo>
          <Ext>{this.getExt()}</Ext>
          <Filename className={'file-icon'}>{attachment.original}</Filename>
        </FileInfo>
        <a target={'_blank'} className={'download-attachment'} href={this.getUrl()}><i
          className={'md-icon'}>save_alt</i></a>
      </File>
    )
  }

  render () {

    const {attachment} = this.props

    const attachmentType = _.get(attachment, 'type')


    return (
      _.get(attachment, 'name') ? <Container className={'message-attachment'}>
        {_.includes(attachmentType, 'image/') ? this.renderImage() : this.renderFile()}
      </Container> : null
    )
  }
}