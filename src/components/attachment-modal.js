import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { closeAttachmentModal, setAttachmentModalSelected } from '../redux/actions'
import _ from 'lodash'

const Container = styled.div`
  width: ${props => props.w}px;
  height: ${props => props.h}px;
  background: rgba(0,0,0,0.86);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000000;

`

const ModalInner = styled.div`
  width: ${props => props.w}px;
  height: ${props => props.h}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

`

const MainImage = styled.div`
  align-items: center;
  display: flex;
  min-height: ${props => props.h}px;
  img{
    flex-grow: 1;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    max-height: ${props => props.maxHeight}px;
  }
`

const CloseButton = styled.button`
  position:absolute;
  right: 20px;
  top: 20px;
  border:  0 none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f7c142;
  display: flex;
  cursor: pointer;
  outline: 0 none;
  &:focus,&:active{
    outline: 0 none;
  }
  justify-content: center;
  i{
    color: #FFF;
    font-size: 24px;
  }

`

const Thumbnails = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
  
`

const Thumbnail = styled.div`
  padding: 5px;
  img{
    height: 90px;
    width: auto;
    max-width: 100%;
    object-fit: cover;
    border-radius: 5px;
    border: ${props => props.active ? '1px solid #f7c142' : '1px transparent'};
  }

`
const Arrows = styled.div`
  
  button {
    cursor: pointer;
    position: absolute;
    top: 45%;
    border: 0 none;
    background: none;
    i{
      color: #FFF;
    }
    &:hover{
      opacity: 0.8;
    }
  }
`

const ArrowLeft = styled.button`
 
  left: 10px;
  
`

const ArrowRight = styled.button`
  right: 10px;
`

class AttachmentModal extends React.Component {

  state = {
    w: window.innerWidth,
    h: window.innerHeight,
    activeIndex: 0,
  }

  componentDidMount () {
    window.addEventListener('resize', this.resize.bind(this))
    window.addEventListener('keydown', this.onkeydown.bind(this))
  }

  onkeydown = (e) => {
    if (e.key === 'Escape') {
      this.props.closeAttachmentModal()
    }
    if (e.key === 'ArrowRight') {
      this.onNext()
    }
    if (e.key === 'ArrowLeft') {
      this.onPrev()
    }
  }
  resize = () => {
    this.setState({
      w: window.innerWidth,
      h: window.innerHeight
    })
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resize.bind(this))
    window.removeEventListener('keydown', this.onkeydown.bind(this))
  }

  getFileUrl = (attachment) => {
    const api = this.props.getApiUrl()
    return `${api}/attachment?name=${attachment.name}`
  }

  onPrev = () => {

    const {attachments} = this.props
    let nextIndex = this.state.activeIndex - 1
    if (nextIndex < 0) {
      nextIndex = attachments.length - 1
    }
    this.setState({
      activeIndex: nextIndex
    }, () => {
      this.props.setAttachmentModalSelected(_.get(attachments, `[${nextIndex}]`))
    })
  }
  onNext = () => {
    const {attachments} = this.props
    let nextIndex = this.state.activeIndex + 1
    if (nextIndex >= attachments.length) {
      nextIndex = 0
    }
    this.setState({
      activeIndex: nextIndex
    }, () => {
      this.props.setAttachmentModalSelected(_.get(attachments, `[${nextIndex}]`))
    })
  }

  render () {
    let {open, attachments, selected} = this.props
    const {w, h} = this.state

    if (!selected) {
      selected = _.get(attachments, '[0]')
    }
    return (
      open ? (
        <Container
          w={w}
          h={h}
          className={'attachment-modal'}>
          <CloseButton onClick={() => {
            this.props.closeAttachmentModal()
          }}>
            <i className={'md-icon'}>close</i>
          </CloseButton>
          {
            attachments.length > 1 && <Arrows>
              <ArrowLeft onClick={this.onPrev}><i className={'md-icon'}>chevron_left</i></ArrowLeft>
              <ArrowRight onClick={this.onNext}><i className={'md-icon'}>chevron_right</i></ArrowRight>
            </Arrows>
          }

          <ModalInner
            w={w}
            h={h}
            className={'modal-inner'}>

            <MainImage
              h={h - 140}
              maxHeight={h - 150}
              className={'modal-main-image'}>
              <img src={this.getFileUrl(selected)} alt={''}/>
            </MainImage>
            <Thumbnails className={'thumbnails'}>
              {
                attachments.map((a, index) => {
                  return (
                    <Thumbnail
                      onClick={() => {
                        this.setState({
                          activeIndex: index
                        }, () => {
                          this.props.setAttachmentModalSelected(a)
                        })

                      }}
                      active={selected.id === a.id}
                      key={index} className={'attachment-thumbnail'}>
                      <img
                        src={this.getFileUrl(a)} alt={''}/>
                    </Thumbnail>
                  )
                })
              }
            </Thumbnails>

          </ModalInner>
        </Container>
      ) : null
    )
  }
}

const mapStateToProps = (state) => ({
  open: state.attachmentModal.open,
  attachments: state.attachmentModal.attachments.filter((a) => _.includes(a.type, 'image/')),
  selected: state.attachmentModal.selected
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getApiUrl: () => {
    return (dispatch, getState, {service}) => {
      return service.getApiUrl()
    }
  },
  closeAttachmentModal,
  setAttachmentModalSelected
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(AttachmentModal)