/**
 * @file index.js
 * @brief Router>Provier>App 순으로 wrapping
 * @author 손완휘
 */
import App from 'App'
//context
import {GlobalProvider} from 'context'
import {RankProvider} from 'context/rank_ctx'
import {ClipRankProvider} from "context/clip_rank_ctx";

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
      <RankProvider>
        <ClipRankProvider>
          <App />
        </ClipRankProvider>
      </RankProvider>
    </GlobalProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
