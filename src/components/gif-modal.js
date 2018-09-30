import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { findGif, selectGif } from '../redux/actions'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
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

const Gif = styled.div`
  float: left;
  height: 100px;
  width: 33%;
  cursor: pointer;
  &:hover{
    opacity: 0.7;
  }
  img{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const NoResult = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 300;
  color: #c4c4c4;
  text-align: center;
`

class GifModal extends React.Component {

  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
    this.search = this.search.bind(this)
    this.onSearch = _.debounce(this.search, 300)

    this.state = {
      search: '',
      limit: 27,
      results: [],
      noResult: false,
      trending: []
    }

  }

  componentDidMount () {

    this.search('', true)

  }

  clearSearch = () => {

    this.setState({
      results: this.state.trending,
      search: '',
      noResult: false
    })
  }
  onChange = (e) => {

    const v = e.target.value
    this.setState({
      search: v,
      noResult: false,
    }, () => {
      this.onSearch(v)
    })
  }

  search = (v, trending = false) => {

    const {limit} = this.state

    if (v === '' && !trending) {
      this.setState({
        noResult: false,
        results: this.state.trending
      })
      return
    }

    this.props.findGif(v, limit, trending).then((data) => {

      this.setState({
        results: data,
        noResult: !data.length,
        trending: trending ? data : this.state.trending,
      })

    }).catch((e) => {

      this.setState({
        results: [],
        noResult: true

      })
    })
  }

  render () {

    let {search, results} = this.state
    const {dock, height} = this.props
    let items = this.props.selected

    if(search === ''){
      _.each(items, (i) => {


        results = results.filter((s) => s.id !== i.id);
      })
    }
    items = search === "" ? items.concat(results) : results;

    let h = dock ? 400 : (height - 240)

    return (
      <Container className={'gif-modal'}>
        <div className={'search-input-container'}>
          <input
            placeholder={'Search...'}
            type={'text'} value={search} onChange={this.onChange}/>
          <Button onClick={() => {
            if (search !== '') {
              this.clearSearch()
            }
          }}><i className={'md-icon'}>{_.trim(search) !== '' ? 'close' : 'search'}</i></Button>
        </div>
        <Inner className={'gif-modal-inner'}>
          {
            this.state.noResult && (
              <NoResult className={'no-result'}>
                Result not found
              </NoResult>
            )
          }
          <Results
            h={h}
            className={'results'}>
            {
              items.map((gif, index) => {
                const url = _.get(gif, 'images.fixed_height_small.url')
                return (
                  <Gif
                    onClick={() => {
                      if (this.props.onSelect) {
                        this.props.onSelect(gif)
                      }

                      this.props.selectGif(gif)

                    }}
                    key={index} className={'gif'}><img src={url} alt={''}/></Gif>
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
  selected: state.gif.selected,
  trending: state.gif.trending
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  findGif,
  selectGif
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GifModal)