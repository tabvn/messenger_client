import React, { Component } from 'react'
import AttachmentModal from './components/attachment-modal'
import AppModal from './components/app-modal'
import Sound from './components/sound'

class App extends Component {
  render () {
    return (
      <div className={'messenger'}>
        {this.props.children}
        <AttachmentModal/>
        <AppModal/>
        <Sound/>
      </div>
    )
  }
}

export default App
