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

import {BroadcastProvider as BroadcastProviderWWW} from "context/broadcast_ctx";
import {Provider} from 'react-redux';
import store from "redux/store";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <GlobalProvider>
        <BroadcastProviderWWW>
          <App/>
        </BroadcastProviderWWW>
      </GlobalProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
