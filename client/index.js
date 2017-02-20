import React from 'react'
import ReactDOM from 'react-dom'

import 'whatwg-fetch'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

import Form from './Form'

const App =  () => {
  return (
    <MuiThemeProvider>
      <Form />
    </MuiThemeProvider>
  )
}

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    <App />,
    document.getElementById('app')
  )
})
