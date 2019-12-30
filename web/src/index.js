import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
//style
import './styles/common.scss'
import './styles/layout.scss'
//context

//----------------------------------------------------------------

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
)
