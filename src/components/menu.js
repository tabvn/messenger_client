import React from 'react'
import styled from 'styled-components'
import Popover from './popover'
import PropTypes from 'prop-types'

const Container = styled.div`
  width: 20px;
  position: relative;
  z-index: 100000;
`

const Button = styled.button`
  border: 0 none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  outline: 0 none;
  background: none;
  &:active,&:focus,&:hover{
    outline: 0 none;
  }
  i{
    color: ${props => props.color};
  }
  
`
const List = styled.div`
  display: flex;
  flex-direction: column;
  background: #FFF;
`

const Item = styled.div`
  padding: 10px 15px;
  margin: 0;
  color: #484848;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  line-height: 1.5;
  &:hover{
    background: #f3f3f3;
  }
  
`

const Title = styled.div`
  color: #484848;
  font-size: 20px;
  padding-left: 5px;
  
`

const Icon = styled.div`
  i{
    font-size: 24px;
    color: #484848;
  }
`

export default class Menu extends React.Component {

  render () {

    const {items, buttonColor, placement} = this.props

    return (

      <Container className={'messenger-menu'}>
        <Popover
          placement={placement}
          target={<Button color={buttonColor} className={'messenger-menu-button'}><i className={'md-icon'}>more_vert</i></Button>}
          content={(
            <List className={'messenger-menu-items'}>
              {
                items.map((i, index) => {
                  return (
                    <Item
                      onClick={() => {
                        if (this.props.onClick) {
                          this.props.onClick(i)
                        }
                      }}
                      key={index} className={'messenger-menu-item'}>
                      <Icon className={'messenger-menu-icon'}><i className={'md-icon'}>{i.icon}</i></Icon>
                      <Title className={'messenger-menu-title'}>{i.title}</Title>
                    </Item>
                  )
                })
              }
            </List>
          )}
        />


      </Container>
    )
  }
}

Menu.defaultProps = {
  items: [],
  buttonColor: '#89a0b5',
  placement: 'bottom',
}
Menu.propTypes = {
  items: PropTypes.array,
  buttonColor: PropTypes.any,
  placement: PropTypes.string,
  onClick: PropTypes.func,
}