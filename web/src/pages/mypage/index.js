/**

* @file /mypage/index.js
 * @brief 마이페이지
 */
import React, {useEffect, useState, useContext} from 'react'
import {Switch, Route, Link, Redirect} from 'react-router-dom'
import styled from 'styled-components'

//layout
import Layout from 'pages/common/layout'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

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

  useEffect(() => {
    if (!profile) {
      props.history.push('/')
    }
  }, [])

  if (!profile) {
    return <></>
  }

  const navigationList = [
    {id: 0, type: 'notice', component: Notice, txt: '공지사항'},
    {id: 1, type: 'fanboard', component: FanBoard, txt: '팬 보드'},
    //{id: 2, type: 'cast', component: Cast, txt: '캐스트'},
    {id: 3, type: 'wallet', component: Wallet, txt: '내 지갑'},
    {id: 4, type: 'report', component: Report, txt: '리포트'},
    // {id: 5, type: 'alert', component: Alert, txt: '알림'},
    {id: 6, type: 'bcsetting', component: BroadcastSetting, txt: '방송 설정'}
  ]

  return (
    <Layout {...props}>
      <Content>
        <MyProfile />

        <Navigation list={navigationList} />

        <SubContent>
          <Switch>
            {navigationList.map(value => {
              const {type, component} = value
              return <Route exact path={`/mypage/${type}`} component={component} key={type} />
            })}
          </Switch>
        </SubContent>
      </Content>
    </Layout>
  )
}

const SubContent = styled.div`
  margin: 0 auto;
`

const Content = styled.section`
  margin: 30px auto 15px auto;
  width: 1210px;
  @media (max-width: 1260px) {
    width: 91.11%;
  }
`
