import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { upload } from '../redux/actions'
import { api } from '../config'
import PropTypes from 'prop-types'

const Container = styled.div`
  padding-bottom: 20px;
  display: flex;
  flex-direction: row;
  label{
    background: none;
    box-shadow: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    width: 55px;
    height: 46px;
    border: 1px dashed #c8c8c8;
    border-radius: 5px;
    justify-content: center;
    align-items: center;
    display: flex;
    &.has-image{
      border:1px transparent;
    }
    i{
      font-size: 28px;
      color: #818181;
    }
    input{
        position: fixed;
        top: -9999px;
       
     }
     
   
  }
`

const Input = styled.input`
    max-width: ${props => props.dock ? '250px' : '100%'};
    flex-grow: 1;
    color: #484848;
    border: 0 none;
    padding: 5px 8px;
    outline: 0 none;
    font-size: 20px;
    width: calc(100% - 60px);
    &:hover,&:focus, &:active{
      outline: 0 none;
    }

`

const Image = styled.img`
  width: 100%;
  border-radius: 5px;
  object-fit: cover;
  height: auto;
  display: ${props => props.active ? 'block' : 'none'};
  
`

class CreateGroupHeader extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      avatar: '',
      value: '',
      uploading: false
    }


    this.avatarUrl = this.avatarUrl.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onAddAvatar = this.onAddAvatar.bind(this)
    this.onAddFile = this.onAddFile.bind(this)

    this._onchange = _.debounce(this.onChange, 400)

  }

  componentDidMount () {
    const {group} = this.props

    const avatar = _.get(group, 'avatar', '')
    this.setState({
      value: _.get(group, 'title', ''),
      avatar: avatar
    })

    if (avatar && this.imageRef) {
      this.imageRef.src = this.avatarUrl(avatar)
    }
  }

  avatarUrl = (name) => {
    return `${api}/group/avatar?name=${name}`
  }


  onChange = (value) => {

    if (this.props.onChange) {
      this.props.onChange(value)
    }

  }

  onAddAvatar = (name = '') => {

    this.setState({
      avatar: name,
      uploading: false
    }, () => {

      this._onchange({
        avatar: name,
        name: this.state.value
      })
    })
  }

  onAddFile = (event) => {
    const file = _.get(event, 'target.files[0]', null)
    const allowTypes = ['image/png', 'image/gif', 'image/jpeg', 'image/jpg', 'image/bmp']
    const type = _.get(file, 'type')
    let reader = new FileReader()

    const ref = this.imageRef

    if (_.includes(allowTypes, type)) {

      reader.onload = function (e) {

        if (ref) {
          ref.src = e.target.result
        }
      }
      // you have to declare the file loading
      reader.readAsDataURL(file)

      this.props.upload(file, (e) => {

        switch (e.type) {

          case 'uploading':

            this.setState({
              uploading: true
            })

            break

          case 'success':

            this.onAddAvatar(e.payload[0].name)

            break

          case 'error':
            this.onAddAvatar('')
            break

          default:

            break
        }

      })
    }

  }

  render () {

    const {placeholder, dock} = this.props
    const {avatar} = this.state
    return (

      <Container
        dock={dock}
        className={'create-group-avatar'}>
        <label
          htmlFor='group-avatar-input' className={`avatar-image ${avatar ? 'has-image' : 'no-image'}`}>
          <Image
            active={!!avatar}
            innerRef={(ref) => this.imageRef = ref} src={''}/>
          {!avatar ? <i className={'md-icon'}>image</i> : null}
          <input
            onChange={this.onAddFile}
            id={'group-avatar-input'} multiple={false} type={'file'} accept={'image/*'}/>
        </label>
        <Input
          dock={dock}
          onChange={(e) => {
            const v = e.target.value
            this.setState({
              value: v,
            }, () => {

              this._onchange({
                name: v,
                avatar: this.state.avatar
              })
            })
          }} placeholder={placeholder} value={this.state.value}/>
      </Container>)
  }
}

CreateGroupHeader.defaultProps = {
  placeholder: 'Name of group'
}

CreateGroupHeader.propTypes = {
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
}
const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  upload
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroupHeader)