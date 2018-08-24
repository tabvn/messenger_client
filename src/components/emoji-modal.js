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

class EmojiModal extends React.Component {


  componentDidMount () {
    this.props.getEmojis()
  }

  render () {

    const {items, selected, dock, height} = this.props

    let results = selected.concat(items)
    let h = dock ? 430 : (height - 210)


    return (
      <Container className={'gif-modal'}>

        <Inner className={'gif-modal-inner'}>
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