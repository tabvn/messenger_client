import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'

const Container = styled.div`
  background: #efefef;
  display: flex;
  padding: 5px 10px;
  input{
    outline: 0 none;
    color: #b0b0b0;
    font-weight: 300;
    font-style: italic;
    border: 0 none;
    padding: 0px 5px;
    min-height: 35px;
    font-size: 12px;
    width: 100%;
    background: transparent;
    &:focus,&:active{
      outline: 0 none;
    }
  }
`
const Button = styled.button`
  padding: 0;
  outline: 0 none;
  width: 30px;
  height: 35px;
  display: flex;
  justify-content: center;
  border: 0 none;
  background: none;
  &:focus,&:active{
    outline: 0 none;
  }
  i{
    color: #b0b0b0;
  }
`
const Inner = styled.div`
  ${props => !props.dock ? 'background: #FFF' : null}
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  padding: 0 5px;
  border-radius: 10px;
`

export default class SidebarSearch extends React.Component {

  constructor (props) {
    super(props)

    this.search = this.search.bind(this)
    this.onChange = this.onChange.bind(this)

    this.state = {
      value: ''
    }

    this._onSearch = _.debounce(this.search, 300)

  }

  search = (value) => {

    if (this.props.onSearch) {
      this.props.onSearch(value)
    }
  }
  onChange = (event) => {

    const value = event.target.value

    this.setState({
      value: value
    }, () => {
      this._onSearch(value)
    })
  }

  render () {

    const {value} = this.state
    const {searchType, dock} = this.props
    const placeholder = searchType === 'user' ? 'Search contacts...' : 'Search messages...'

    return (
      <Container
        dock={dock}
        className={'sidebar-search'}>
        <Inner
          dock={dock}
          className={'search-inner'}>
          <input value={value} placeholder={placeholder} onChange={this.onChange}/>
          <Button className={'search-button'} onClick={() => {
            if (value !== '') {
              this.setState({
                value: '',
              }, () => {

                this.search('')
              })
            }
          }}><i className={'md-icon'}>{_.trim(value) === '' ? 'search' : 'close'}</i></Button>
        </Inner>
      </Container>

    )
  }
}