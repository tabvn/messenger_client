import React from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-grow: 1;
`
const Close = styled.div`
  cursor: pointer;
  border: 0 none;
  outline: 0 none;
  margin: 0;
  padding: 0;
  position: absolute;
  right: 10px;
  top: 10px;
  color: #adadad;
  i{
    color: #adadad;
  }
`
const Inner = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px 10px;
  
`

const Question = styled.div`
  display: flex;
  flex-direction: row;
  padding: ${props => props.dock ? 5 : 10}px 0;
  
`

const Check = styled.div`
  selection: none;
  width: 30px;
  i{
    cursor: pointer;
    color: #000;
  }
  &.is-checked{
    i{
      color: #2397e8;
    }
  }
`

const Title = styled.div`
  cursor: pointer;
  flex-grow: 1;
  color: #000000;
  font-size: ${props => props.dock ? 16 : 21}px;
  strong{
    font-size: ${props => props.dock ? 16 : 21}px;
    font-weight: 700;
  }
  
`

const ExplainTitle = styled.div`
  
  color: #000000;
  font-size: ${props => props.dock ? 16 : 21}px;
  strong{
    font-size: ${props => props.dock ? 16 : 21}px;
    font-weight: 700;
  }
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 14px;
`
const Explain = styled.div`
  
  textarea {
    margin-top: 18px;
    background: #ececec;
    width: 100%;
    height: 80px;
    border: 0 none;
    border-radius: 8px;
    color: #818181;
    font-style: italic;
    font-size: 16px;
    padding: 20px 10px;
  }
`

const Submit = styled.button`
  background: #2397e8;
  color: #FFF;
  font-weight: 700;
  font-size: 15px;
  padding: 10px 15px;
  text-align: center;
  border: 0 none;
  border-radius: 5px;
  cursor: pointer;
`

const OPTIONS = [
  {
    title: 'Harassment',
    description: 'Adversarial or harmful actions taken by this user directed at a person or group.',
    id: 1,
  },
  {
    title: 'General Spam',
    description: 'Fake Profile, producing fake content, or Inactive member.',
    id: 2,
  },
  {
    title: 'Promotional Spam',
    description: 'Member promotion Inappropriate links, products, websites, or facilities.',
    id: 3,
  },
  {
    title: 'Insincere',
    description: 'Member isn\'t participating authentically or is being sarcastic or disrespectful.',
    id: 4,
  },

]

class ChatReportModal extends React.Component {

  state = {
    selected: 2,
  }

  handleSelect = (i) => {
    this.setState({
      selected: i,
      value: '',
      sent: false,
    })
  }

  handleSubmit = () => {
    const {value} = this.state
    const {users} = this.props

    if (this.state.sent) {
      return
    }

    let ids = []

    _.each(users, (user) => {

      const uid = _.get(user, 'uid')
      if (uid) {
        ids.push(uid)
      }

    })
    this.setState({
      sent: true,
    }, () => {

      const option = OPTIONS[this.state.selected]
      const data = {
        users: ids,
        options: option.id,//`${option.title}: ${option.description}`,
        message: value,
      }
      this.props.report(data)
      if (this.props.onClose) {
        this.props.onClose()
      }
    })

  }

  render () {
    const {selected} = this.state
    const {dock} = this.props

    return (
      <Container className={'chat-report-modal'}>
        <Close onClick={() => {
          if (this.props.onClose) {
            this.props.onClose()
          }
        }} className={'close-modal'}><i className={'md-icon'}>close</i></Close>

        <Inner className={'chat-report-modal-inner'}>
          {
            OPTIONS.map((option, index) => {

              const isChecked = selected === index

              return (
                <Question
                  dock={dock} onClick={() => this.handleSelect(index)} key={index}
                  className={'report-question'}>
                  <Check className={`question-select ${isChecked ? 'is-checked' : 'un-checked'}`}>
                    <i className={'md-icon'}>{
                      isChecked ? 'radio_button_checked' : 'radio_button_unchecked'
                    }</i>
                  </Check>
                  <Title dock={dock} className={'report-question-inner'}>
                    <strong>{option.title}: </strong> {option.description}
                  </Title>
                </Question>
              )
            })
          }
          <Explain className={'explain-report'}>
            <ExplainTitle dock={dock}>
              <strong>Optional:</strong> Explain This Report
            </ExplainTitle>
            <textarea placeholder={'type your message here'} value={this.state.value} onChange={(e) => {
              this.setState({
                value: e.target.value,
              })
            }} className={'explain-report'}/>
          </Explain>

          <Actions className={'actions'}>
            <Submit disabled={this.state.sent} onClick={this.handleSubmit}>Submit</Submit>
          </Actions>
        </Inner>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  report: (data) => {
    return (dispatch, getState, {service}) => {
      return service.report(data)
    }
  }
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChatReportModal)