import React from 'react';
import styled from 'styled-components';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {toggleSidebar} from '../redux/actions';

const Container = styled.div`
  display: flex;
  flex-direction:column;
  ${props => !props.dock ? 'background: #efefef' : null}
`;
const Button = styled.button`
  padding: 3px;
  margin: 0;
  cursor: pointer;
  color: #b0b0b0;
  border: 0 none;
  outline: 0 none;
  background: none;
  &:active, &:focus{
    outline: 0 none;
  }
  &:hover{
    background: #ebebeb;
  }
`;

class SidebarFooter extends React.Component {

  handleCreateGroup = () => {
    if (this.props.onCreateGroup) {
      this.props.onCreateGroup();
    }
  };

  render() {
    const {sidebarIsOpen, dock} = this.props;

    return (
        !sidebarIsOpen ?
            <Container
                dock={dock}
                className={'sidebar-footer'}>
              <Button
                  onClick={() => {
                    if (this.props.onCreateConversation) {
                      this.props.onCreateConversation();
                    }
                  }}
                  className={'create-conversation'}><i
                  className={'md-icon md-24'}>edit</i></Button>
              <Button onClick={() => this.handleCreateGroup()}
                      className={'create-group-conversation'}><i
                  className={'md-icon md-24'}>group</i></Button>
              <Button onClick={() => {
                this.props.toggleSidebar(true);
              }} className={'create-group-conversation'}><i
                  className={'md-icon md-24'}>search</i></Button>
            </Container> : null
    );
  }
}

const mapStateToProps = (state) => ({
  sidebarIsOpen: state.sidebar.open,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SidebarFooter);