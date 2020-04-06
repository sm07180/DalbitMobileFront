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

const Secession = React.lazy(() => import('pages/secession'))

const NotFound = React.lazy(() => import('pages/not_found'))

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

        <Route exact path="/secession" component={Secession} />
        <Route exact path="/navigator" component={Navigator} />

        <Route exact path="/notfound" component={NotFound} />
        <Redirect to="/notfound" component={NotFound} />
      </Switch>
    </React.Suspense>
  )
}
