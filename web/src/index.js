/**
 * @file index.js
 * @brief Router>Provier>App 순으로 wrapping
 * @author 손완휘
 */
import App from 'App'
//context
import {GlobalProvider} from 'context'
import {RankProvider} from 'context/rank_ctx'

import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
//style
import 'styles/reset.scss'
import 'styles/common.scss'
import 'styles/swiper.scss'

import { BroadcastProvider as BroadcastProviderWWW } from "context/broadcast_ctx";
import { MailboxProvider as MailboxProviderWWW } from "context/mailbox_ctx";
import { ModalProvider as ModalProviderWWW } from "context/modal_ctx";
import { RankProvider  as RankProviderWWW} from "context/rank_ctx";
import { ClipRankProvider  as ClipRankProviderWWW} from "context/clip_rank_ctx";
import { Provider } from 'react-redux';
import store from "redux/store";

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <GlobalProvider>
          <RankProvider>
              <MailboxProviderWWW>
                  <BroadcastProviderWWW>
                      <RankProviderWWW>
                          <ClipRankProviderWWW>
                            <ModalProviderWWW>
                                <App />
                            </ModalProviderWWW>
                        </ClipRankProviderWWW>
                    </RankProviderWWW>
                </BroadcastProviderWWW>
            </MailboxProviderWWW>
          </RankProvider>
      </GlobalProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
)
