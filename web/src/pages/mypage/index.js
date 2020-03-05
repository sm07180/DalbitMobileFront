/**

* @file /mypage/index.js
 * @brief 마이페이지
 */
import React, {useEffect, useState} from 'react'
import {Switch, Route, Link} from 'react-router-dom'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout'
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

//context
import Api from 'context/api'

//components
import MyProfile from './content/myProfile.js'
import Navigation from './content/navigation.js'

import Notice from './content/notice.js'
import FanBoard from './content/fanBoard.js'
import Cast from './content/cast.js'
import Wallet from './content/wallet.js'
import Report from './content/report.js'
import Alert from './content/alert.js'
import Setting from './content/setting.js'

//
const User = props => {
  //---------------------------------------------------------------------
  // props.index 값 받았을 시 해당되는 탭을 on 시켜줌, 값 없을 시 기본 0
  //---------------------------------------------------------------------
  return (
    <Layout {...props}>
      <ContentHeader>
        <h1>
          <a href="/">마이페이지</a>
        </h1>
        {/* <MypageButton>방송국 관리</MypageButton> */}
      </ContentHeader>
      <Content>
        <MyProfile />

        <Navigation />

        <SubContent>
          <Switch>
            <Route exact path="/mypage/notice" component={Notice} />
            <Route exact path="/mypage/fanboard" component={FanBoard} />
            <Route exact path="/mypage/cast" component={Cast} />
            <Route exact path="/mypage/wallet" component={Wallet} />
            <Route exact path="/mypage/report" component={Report} />
            <Route exact path="/mypage/alert" component={Alert} />
            <Route exact path="/mypage/setting" component={Setting} />
          </Switch>
        </SubContent>
      </Content>
    </Layout>
  )
}
export default User

const SubContent = styled.div`
  margin: 0 auto;

  @media (max-width: ${WIDTH_PC}) {
    width: 90%;
  }
`

const ContentHeader = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;

  h1 {
    display: inline-block;
  }
`

const Content = styled.section`
  margin: 30px 0 100px 0;
`
