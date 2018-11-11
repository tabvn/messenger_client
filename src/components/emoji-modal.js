import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getEmojis, selectEmoji } from '../redux/actions'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
  position: relative;
  
  .search-input-container{
    background: #f8f8f8;
    display: flex;
    flex-direction:row;
    padding: 0 5px;
    border-radius: 5px;
    input{
      font-size: 15px;
      font-style: italic;
      color: #b0b0b0;
      min-height:40px; 
      border: 0 none;
      background: transparent;
      padding: 8px 10px;
      flex-grow: 1;
      max-width: 99%;
    }
  }
  
`

const Inner = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`

const Results = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  height: ${props => props.h}px;
  padding: 0 20px 0 10px;
  
`

const Emoji = styled.div`
  padding: 5px;
  width: 30px;
  line-height: 30px;
  display: inline-table;
  text-align: center;
  cursor: pointer;
  vertical-align: middle;
  font-size: 28px;
  transition: -webkit-transform 60ms ease-out;
  transition: transform 60ms ease-out;
  transition: transform 60ms ease-out, -webkit-transform 60ms ease-out;
  transition-delay: 60ms;
  font-family: Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;
  &:hover {
      transition-delay: 0ms;
      -webkit-transform: scale(1.4);
      -ms-transform: scale(1.4);
      transform: scale(1.4);
  }

`

const Tabs = styled.div`
  box-shadow: 0 -5px 5px -5px #eaeaea;
  position: absolute;
  bottom: 1px;
  left:0;
  display: flex;
  flex-direction: row;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  align-items: center;
  width: 100%;
`

const Tab = styled.div`
 
  font-family: Apple Color Emoji, Segoe UI Emoji, NotoColorEmoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;
  font-size: 30px;
  line-height: 30px;
  display: block;
  padding: 0;
  span{
   -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
    flex-basis: 35px;
    cursor: pointer;
    text-align: center;
    padding: 8px 14px;
    display: block;
    background-color: ${props => props.selected ? '#e9ebee' : '#FFF'};
    font-size: 30px;
    line-height: 30px;
    &:hover{
       background-color: #e9ebee;
    }
   
  }
  &:first-child{
    span{
      border-bottom-left-radius: 8px;
    }
  }
    
`

const Button = styled.button`
  cursor: pointer;
  border: 0 none;
  padding: 0;
  background: none;
  outline: 0 none;
  &:active,&:focus{
    outline: 0 none;
  }
  i{
    color: #4d4d4d;
    font-size: 20px;
  }
`

const FILTERS = [
  {
    title: 'People',
    name: 'People',
    icon: '😀'
  },
  {
    title: 'Nature',
    name: 'Nature',
    icon: '🐶'
  },
  {
    title: 'Objects',
    name: 'Objects',
    icon: '📦'
  },
  {
    title: 'Places',
    name: 'Places',
    icon: '🚘'
  },
  {
    title: 'Symbols',
    name: 'Symbols',
    icon: '❤️'
  },
  {
    title: 'Flags',
    name: 'Flags',
    icon: '🚩'
  }
]

class EmojiModal extends React.Component {

  state = {
    selected: 'People',
    value: '',
  }

  componentDidMount () {
    this.props.getEmojis()
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  clearSearch = () => {
    this.setState({
      value: ''
    })
  }

  render () {

    const {value} = this.state
    let {items, selected, dock, height} = this.props

    if (value !== '') {
      items = items.filter((s) => {

        if (_.includes(s.description, value) || _.includes(_.get(s, 'aliases'), value)) {
          return true
        }

        return false
      })
    } else {
      items = items.filter((s) => s.category === this.state.selected)
    }

    let results = selected.concat(items)

    let h = dock ? 360 : (height - 280)

    return (
      <Container className={'gif-modal'}>

        <Inner className={'gif-modal-inner'}>
          <div className={'search-input-container'}>
            <input
              placeholder={'Search emojis'}
              type={'text'} value={value} onChange={this.onChange}/>
            <Button onClick={() => {
              if (value !== '') {
                this.clearSearch()
              }
            }}><i className={'md-icon'}>{_.trim(value) !== '' ? 'close' : 'search'}</i></Button>
          </div>

          <Results
            h={h}
            className={'results'}>
            {
              results.map((e, index) => {
                return (
                  <Emoji
                    onClick={() => {

                      if (this.props.onSelect) {
                        this.props.onSelect(e)
                      }

                      this.props.selectEmoji(e)
                    }}
                    key={index} className={'emoji-item'}>
                    {
                      _.get(e, 'emoji', '')
                    }
                  </Emoji>
                )
              })
            }
          </Results>
        </Inner>

        <Tabs className={'emoji-filter'}>
          {
            FILTERS.map((c) => {
              return <Tab title={c.title} selected={this.state.selected === c.name} onClick={() => {

                this.setState({
                  selected: c.name,
                })
              }}>
                <span>{c.icon}</span>
              </Tab>
            })
          }
        </Tabs>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  items: state.emoji.items,
  selected: state.emoji.selected
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getEmojis,
  selectEmoji
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EmojiModal)