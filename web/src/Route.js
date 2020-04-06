/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'

import Navigator from './pages/navigator'
import Main from './pages/main'

const MobileMenu = React.lazy(() => import('pages/mMenu'))
const Ranking = React.lazy(() => import('pages/ranking'))
const MobileMyPage = React.lazy(() => import('pages/m_mypage/index.js'))
const MobileMySetting = React.lazy(() => import('pages/m_mypage/setting.js'))
const MobilePay = React.lazy(() => import('pages/mpay'))
const MobileStore = React.lazy(() => import('pages/mStore'))
const Customer = React.lazy(() => import('pages/customer'))
const MobileSetting = React.lazy(() => import('pages/msetting'))
const MobileUser = React.lazy(() => import('pages/m_user'))

const Live = React.lazy(() => import('pages/mlive'))
const Login = React.lazy(() => import('pages/login'))
const SignUp = React.lazy(() => import('pages/sign_up'))
const Password = React.lazy(() => import('pages/password'))

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
        <Route exact path="/rank" component={Ranking} />
        <Route exact path="/mpay" component={MobilePay} />
        <Route exact path="/store" component={MobileStore} />
        <Route exact path="/muser" component={MobileUser} />
        <Route exact path="/muser/:title" component={MobileUser} />

        <Route exact path="/live" component={Live} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/password" component={Password} />

        <Route exact path="/mmypage/:memNo" component={MobileMyPage} />
        <Route exact path="/mmypage/:memNo/:type" component={MobileMyPage} />
        <Route exact path="/my/setting" component={MobileMySetting} />

        <Route exact path="/customer/" component={Customer} />
        <Route exact path="/customer/:title" component={Customer} />
        <Route exact path="/customer/:title/:num" component={Customer} />

        <Route exact path="/msetting/" component={MobileSetting} />

        <Route exact path="/secession" component={Secession} />
        <Route exact path="/navigator" component={Navigator} />

        <Route exact path="/notfound" component={NotFound} />
        <Redirect to="/notfound" component={NotFound} />
      </Switch>
    </React.Suspense>
  )
}
