import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updateUserStatus } from '../redux/actions'
import Popover from './popover'
import _ from 'lodash'

const Container = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
`
const Status = styled.div`
     padding: 0 8px; 
     position: relative;
     cursor: pointer;
     font-weight: 400;
     font-size: 15px;
     display: flex;
     min-height: 27px;
     align-items: center;
     > span {
        &.offline{
            background: rgba(177, 187,192,1);
        }
        &.online {
            background: rgba(119, 183,103,1);
        }
        &.busy {
            background: rgba(244, 67,54,1);
        }
        &.away {
            background: rgba(247, 173,55,1);
        }
     }
`
const StatusDropDown = styled.div`
    display: flex;
    flex-direction: column;
    z-index: 1000;
    min-width: 100px;
    min-height: 80px;
    background: #FFF;
   
   
`
const StatusDropDownItem = styled.div`
    cursor: pointer;
    text-align: left;
    padding: 5px 10px;
    background: ${props => props.active ? 'rgba(0,0,0,0.05)' : '#FFF'};
    &:hover{
        background: rgba(0,0,0,0.05);
    }
    &:before{
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        display: inline-block;
        background: rgba(177, 187,192,1);
        margin-right: 8px;
    }
    &.offline{
          &:before {
              background:  rgba(177, 187,192,1);
          }
        }
    &.online {
        &:before {
            background: rgba(119, 183,103,1);
        }
    }
    &.busy {
        &:before {
            background: rgba(244, 67,54,1);
        }
    }
    &.away {
        &:before{
            background: rgba(247, 173,55,1);
        }
    }
    
`

const StatusCircle = styled.span`
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(177, 187,192,1);
      
`
const StatusTitle = styled.div`
    padding: 0 5px;
    &.online{
      color: rgba(119, 183,103,1);
    }
    &.offline{
      color: rgba(177, 187,192,1);
    }
     &.busy{
      color: rgba(244, 67,54,1);
    }
    &.away{
     color: rgba(247, 173,55,1);
    }
`

const statuses = [
  {
    title: 'Online',
    value: 'online'

  },
  {
    title: 'Away',
    value: 'away'
  },
  {
    title: 'Busy',
    value: 'busy'
  },
  {
    title: 'Invisible',
    value: 'offline'
  }
]

class SidebarUserStatus extends React.Component {

  render () {

    const {open, status} = this.props

    return (
      <Container
        className={'ar-messenger-statuses-wrapper'}
        isOpen={open}>
        <Popover
          placement={'bottom'}
          target={(
            <Status className={'ar-user-status'}>
              <StatusCircle className={`user-status-circle ${status}`}/>
              <StatusTitle className={`status-title ${status}`}>{_.startCase(status)}</StatusTitle>
            </Status>
          )}
          content={(
            <StatusDropDown className={'status-dropdown-list'}>
              {
                statuses.map((item, index) => {

                  return (
                    <StatusDropDownItem
                      className={`status-dropdown-item ${_.toLower(item.value)}`}
                      onClick={() => {
                        this.props.updateUserStatus(item.value, true)
                      }} active={item.value === status}
                      key={index}><span/>{item.title}
                    </StatusDropDownItem>
                  )

                })
              }
            </StatusDropDown>
          )}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  open: state.sidebar.open,
  status: state.userStatus,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateUserStatus
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SidebarUserStatus)