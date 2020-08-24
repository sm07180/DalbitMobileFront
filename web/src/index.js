/**
 * @file index.js
 * @brief Router>Provier>App 순으로 wrapping
 * @author 손완휘
 */
import App from 'App'
//context
import {GlobalProvider} from 'context'
import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
//style
import 'styles/reset.scss'
import 'styles/common.scss'
import 'styles/swiper.scss'

ReactDOM.render(
  <BrowserRouter>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
