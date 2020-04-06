/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'

import Navigator from './pages/navigator'

import Main from './pages/main'
const Menu = React.lazy(() => import('pages/menu'))
const Ranking = React.lazy(() => import('pages/ranking'))
const MyPage = React.lazy(() => import('pages/mypage'))
const MySetting = React.lazy(() => import('pages/mypage/setting.js'))

const Pay = React.lazy(() => import('pages/pay'))
const Store = React.lazy(() => import('pages/store'))
const Customer = React.lazy(() => import('pages/customer'))
const Setting = React.lazy(() => import('pages/setting'))

const MobileUser = React.lazy(() => import('pages/m_user'))

const Live = React.lazy(() => import('pages/live'))
const Login = React.lazy(() => import('pages/login'))
const SignUp = React.lazy(() => import('pages/sign_up'))
const Password = React.lazy(() => import('pages/password'))

const Secession = React.lazy(() => import('pages/secession'))
const ErrorPage = React.lazy(() => import('pages/common/error'))

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
        <Route exact path="/menu/:category" component={Menu} />
        <Route exact path="/rank" component={Ranking} />
        <Route exact path="/pay" component={Pay} />
        <Route exact path="/store" component={Store} />

        <Route exact path="/muser" component={MobileUser} />
        <Route exact path="/muser/:title" component={MobileUser} />

        <Route exact path="/live" component={Live} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/password" component={Password} />

        <Route exact path="/mypage/:memNo" component={MyPage} />
        <Route exact path="/mypage/:memNo/:type" component={MyPage} />
        <Route exact path="/private" component={MySetting} />

        <Route exact path="/customer/" component={Customer} />
        <Route exact path="/customer/:title" component={Customer} />
        <Route exact path="/customer/:title/:num" component={Customer} />

        <Route exact path="/setting" component={Setting} />
        <Route exact path="/secession" component={Secession} />
        <Route exact path="/navigator" component={Navigator} />

        <Route exact path="/error" component={ErrorPage} />
        <Redirect to="/error" />
      </Switch>
    </React.Suspense>
  )
}
