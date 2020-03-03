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
import Notice from './content/notice.js'
import MyWallet from './content/myWallet'
//import FanBoard from './content/fanBoard.js'
//import Report from './content/report'
//import Setting from './content/setting'

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

        <Switch>
          <Route exact path="/mypage/notice" component={Notice} />
        </Switch>
      </Content>
    </Layout>
  )
}
export default User

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
