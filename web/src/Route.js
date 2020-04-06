/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'

import Navigator from './pages/navigator'
import Main from './pages/main'

// mobile page
const MobileMenu = React.lazy(() => import('pages/mMenu'))
const MobileRanking = React.lazy(() => import('pages/mranking'))
const MobileMyPage = React.lazy(() => import('pages/m_mypage/index.js'))
const MobileMySetting = React.lazy(() => import('pages/m_mypage/setting.js'))
const MobilePay = React.lazy(() => import('pages/mpay'))
const MobileStore = React.lazy(() => import('pages/mStore'))
const MobileLogin = React.lazy(() => import('pages/mLogin'))
const MobileCustomer = React.lazy(() => import('pages/mcustomer'))
const MobileSetting = React.lazy(() => import('pages/msetting'))
const MobileUser = React.lazy(() => import('pages/m_user'))
const mLive = React.lazy(() => import('pages/mlive'))

//setting
const Setting = React.lazy(() => import('pages/setting'))
//secession
const Secession = React.lazy(() => import('pages/secession'))
export default () => {
  return (
    <React.Suspense
      fallback={
        <div className="loading">
          <span></span>
        </div>
      }>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/menu/:category" component={MobileMenu} />
        <Route exact path="/mranking" component={MobileRanking} />
        <Route exact path="/mpay" component={MobilePay} />
        <Route exact path="/mstore" component={MobileStore} />
        <Route exact path="/mlogin" component={MobileLogin} />
        <Route exact path="/muser" component={MobileUser} />
        <Route exact path="/muser/:title" component={MobileUser} />

        <Route exact path="/mlive" component={mLive} />

        <Route exact path="/mmypage/:memNo" component={MobileMyPage} />
        <Route exact path="/mmypage/:memNo/:type" component={MobileMyPage} />
        <Route exact path="/my/setting" component={MobileMySetting} />

        <Route exact path="/mcustomer/" component={MobileCustomer} />
        <Route exact path="/mcustomer/:title" component={MobileCustomer} />
        <Route exact path="/mcustomer/:title/:num" component={MobileCustomer} />

        <Route exact path="/msetting/" component={MobileSetting} />

        <Route exact path="/setting" component={Setting} />
        <Route exact path="/secession" component={Secession} />
        <Route exact path="/navigator" component={Navigator} />

        {/* <Redirect to="/error" /> */}
      </Switch>
    </React.Suspense>
  )
}
