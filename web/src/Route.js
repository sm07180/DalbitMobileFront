/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
//
import Navigator from './pages/navigator'
import newMain from './pages/newMain'

/*-common-*/
const Main = React.lazy(() => import('pages/main'))
const BroadCast = React.lazy(() => import('pages/broadcast'))
const BroadCastSetting = React.lazy(() => import('pages/broadcast-setting'))
const Guide = React.lazy(() => import('pages/guide'))
const Login = React.lazy(() => import('pages/login'))
const User = React.lazy(() => import('pages/user'))
const Cast = React.lazy(() => import('pages/cast'))
const Ranking = React.lazy(() => import('pages/ranking'))
const Store = React.lazy(() => import('pages/store'))
const Event = React.lazy(() => import('pages/event'))
const Mypage = React.lazy(() => import('pages/mypage'))
const MypageSetting = React.lazy(() => import('pages/mypage/setting.js'))
const Search = React.lazy(() => import('pages/search'))
const TestPage = React.lazy(() => import('pages/testpage'))

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

//
const error = React.lazy(() => import('pages/common/error'))
const NotFoundPage = React.lazy(() => import('pages/common/error'))
//live pub
const Live = React.lazy(() => import('pages/live'))
//customer-service
const Customer = React.lazy(() => import('pages/customer'))
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

        <Route exact path="/new" component={newMain} />
        <Route exact path="/menu/:category" component={MobileMenu} />
        <Route exact path="/mranking" component={MobileRanking} />
        <Route exact path="/mpay" component={MobilePay} />
        <Route exact path="/mstore" component={MobileStore} />
        <Route exact path="/mlogin" component={MobileLogin} />
        <Route exact path="/muser" component={MobileUser} />
        <Route exact path="/muser/:title" component={MobileUser} />

        <Route exact path="/mmypage/:memNo" component={MobileMyPage} />
        <Route exact path="/mmypage/:memNo/:type" component={MobileMyPage} />
        <Route exact path="/my/setting" component={MobileMySetting} />

        <Route exact path="/mcustomer/" component={MobileCustomer} />
        <Route exact path="/mcustomer/:title" component={MobileCustomer} />
        <Route exact path="/mcustomer/:title/:num" component={MobileCustomer} />

        <Route exact path="/msetting/" component={MobileSetting} />

        <Route exact path="/broadcast" component={BroadCast} />
        <Route exact path="/broadcast-setting" component={BroadCastSetting} />
        <Route exact path="/cast" component={Cast} />
        <Route exact path="/ranking" component={Ranking} />
        <Route exact path="/user" component={User} />
        <Route exact path="/user/:title" component={User} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/mlive" component={mLive} />
        <Route exact path="/store" component={Store} />
        <Route exact path="/event" component={Event} />
        <Route path="/guide" component={Guide} />
        <Route exact path="/mypage/setting" component={MypageSetting} />
        <Route exact path="/mypage/:sub" component={Mypage} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/customer/" component={Customer} />
        <Route exact path="/customer/:title" component={Customer} />
        <Route exact path="/customer/:title/:num" component={Customer} />
        {/* <Route exact path="/customer/:faq" component={Customer} />
        <Route exact path="/customer/:personal" component={Customer} /> */}

        {/* <Route exact path="/customer/:notice" component={Customer} />
        <Route exact path="/customer/:notice:num" component={Customer} />
        <Route exact path="/customer/:faq" component={Customer} />
        <Route exact path="/customer/:personal" component={Customer} /> */}

        <Route exact path="/setting" component={Setting} />
        <Route exact path="/secession" component={Secession} />
        <Route exact path="/navigator" component={Navigator} />
        <Route exact path="/errors" component={error} />
        <Route exact path="/testpage" component={TestPage} />
        {/* 페이지가 없을경우 500 error page */}
        <Route path="/error" component={NotFoundPage} />
        <Redirect to="/error" />
      </Switch>
    </React.Suspense>
  )
}
