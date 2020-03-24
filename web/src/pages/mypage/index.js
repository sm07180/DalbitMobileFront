/**

* @file /mypage/index.js
 * @brief 마이페이지
 */
import React, {useEffect, useState, useContext} from 'react'
import {Switch, Route, Link, Redirect} from 'react-router-dom'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout'
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

//context
import Api from 'context/api'
import {Context} from 'context'

//components
import MyProfile from './content/myProfile.js'
import Navigation from './content/navigation.js'

import Notice from './content/notice.js'
import FanBoard from './content/fanBoard.js'
import Cast from './content/cast.js'
import Wallet from './content/wallet.js'
import Report from './content/report.js'
import Alert from './content/alert.js'
import BroadcastSetting from './content/broadcastSetting.js'
import Ready from './content/ready.js'
//

export default props => {
  const ctx = useContext(Context)
  const {profile} = ctx
  if (!profile) {
    props.history.push('/')
    return <div></div>
  }

  return (
    <Layout {...props}>
      <Content>
        <MyProfile />

        <Navigation />

        <SubContent>
          <Switch>
            <Route exact path="/mypage/notice" component={Notice} />
            <Route exact path="/mypage/fanboard" component={FanBoard} />
            <Route exact path="/mypage/cast" component={Ready} />
            <Route exact path="/mypage/wallet" component={Wallet} />
            <Route exact path="/mypage/report" component={Ready} />
            <Route exact path="/mypage/alert" component={Ready} />
            <Route exact path="/mypage/bcsetting" component={Ready} />
            <Redirect to="/error" />
          </Switch>
        </SubContent>
      </Content>
    </Layout>
  )
}

const SubContent = styled.div`
  margin: 0 auto;

  @media (max-width: ${WIDTH_PC}) {
    width: 90%;
  }
`

const Content = styled.section`
  margin: 30px 0 100px 0;
`
