/**
 * @file index.js
 * @brief Router>Provier>App 순으로 wrapping
 * @author 손완휘
 */
import App from 'App'

import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
//style
import 'styles/reset.scss'
import 'styles/common.scss'
import 'styles/swiper.scss'

import {Provider} from 'react-redux';
import store from "redux/store";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
