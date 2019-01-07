import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'

const Container = styled.div`
  width: 100%;
  margin: 8px 0; 
`
const Content = styled.div`
  width: ${props => props.w}px;
  max-width: 100%;
  background: rgba(241,241,244, 1);
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
  img{
    border-top-right-radius: 5px;
    max-width: 100%;
    height: auto;
  }
  
`

const Title = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: rgba(58,58,57,1);
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

const Description = styled.div `
  font-weight: 400;
  font-size: 13px;
  color: rgba(58,58,57,0.8);
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 200px;
  padding: 5px 0;
`
const Url = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

`

const Footer = styled.div`
  padding: 5px;
  cursor: pointer;
`

class WebScreenshot extends React.Component {

  state = {
    fetching: false,
    data: null,
    title: '',
    w: 0,

  }

  componentDidMount () {
    const {url} = this.props
    this.shot(url)
  }

  shot (url) {

    this.props.shot(url).then((shot) => {

      if(_.get(shot, 'quickData')){

        this.setState({
          data: _.get(shot, 'quickData.image'),
          title: _.get(shot, 'quickData.title'),
          description: _.get(shot, 'quickData.description'),
          w: 320,

        })
      }else{
        const data = `data:${shot.screenshot.mime_type};base64,${shot.screenshot.data}`
        this.setState({
          data: data,
          title: shot.title,
          description: shot.description,
          w: shot.screenshot.width,
        })
      }


    })
  }

  render () {
    const {url} = this.props
    return (
      <Container className={'ar-web-shot'}>
        {
          this.state.data ? (
            <Content w={this.state.w} className={'ar-web-shot-content'}>
              <img src={this.state.data}/>
              <Footer onClick={() => {
                window.open(url, '_blank')
              }}>
                <Title title={this.state.title}>{this.state.title}</Title>
                <Description title={this.state.description}>{this.state.description}</Description>
                <Url title={url}>{url}</Url>
              </Footer>
            </Content>
          ) : null
        }
      </Container>
    )
  }

}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  shot: (url) => {
    return (dispatch, getState, {service}) => {

      const query = `query og {
        og(url: "${url}"){
          title
          description
          image
        }
      }
    `

      const _service = service

      return new Promise((resolve, reject) => {
        service.request(query).then((res) => {
          const data = _.get(res, 'og')

          if (_.get(data, 'image')) {
            return resolve({quickData: data})
          } else {

            return _service.webShot.shot(url).then((shot) => {
              resolve(shot);
            })
          }

        })
          .catch(() => {
            return _service.webShot.shot(url).then((shot) => {
              resolve(shot);
            })
          })

      })

    }
  }
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WebScreenshot)