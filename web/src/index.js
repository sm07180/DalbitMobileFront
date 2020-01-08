/**
 * @file index.js
 * @brief Router>Provier>App 순으로 wrapping
 * @author 손완휘
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import App from './App'
//style
import './styles/common.scss'
import './styles/layout.scss'
import './styles/swiper.scss'
//context
import {GlobalProvider} from './context'
//
ReactDOM.render(
  <BrowserRouter>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
