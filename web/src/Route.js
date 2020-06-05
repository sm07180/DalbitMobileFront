/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'

import Navigator from './pages/navigator'

import ScrollToTop from 'components/lib/ScrollToTop'

import Main from 'pages/main'
const Menu = React.lazy(() => import('pages/menu'))
const Ranking = React.lazy(() => import('pages/ranking'))
const Ranking2 = React.lazy(() => import('pages/ranking2'))
const Ranking3 = React.lazy(() => import('pages/ranking3'))
const MyPage = React.lazy(() => import('pages/mypage'))
const MySetting = React.lazy(() => import('pages/mypage/setting.js'))

const Pay = React.lazy(() => import('pages/pay'))
const PayResult = React.lazy(() => import('pages/pay_result'))
const Store = React.lazy(() => import('pages/store'))
let Charge = React.lazy(() => import('pages/charge'))
if(__NODE_ENV === 'real'){
    Charge = React.lazy(() => import('pages/charge/index_bak'))
}
const Exchange = React.lazy(() => import('pages/exchange'))
const Customer = React.lazy(() => import('pages/customer'))
const Setting = React.lazy(() => import('pages/setting'))
const Event = React.lazy(() => import('pages/event'))
const EventPage = React.lazy(() => import('pages/event_page'))

const Live = React.lazy(() => import('pages/live'))
const Login = React.lazy(() => import('pages/login'))
const SignUp = React.lazy(() => import('pages/sign_up'))
const Password = React.lazy(() => import('pages/password'))
const SelfAuth = React.lazy(() => import('pages/self_auth'))
const SelfAuthResult = React.lazy(() => import('pages/self_auth_result'))
const Agree = React.lazy(() => import('pages/agree'))

const Secession = React.lazy(() => import('pages/secession'))
const ErrorPage = React.lazy(() => import('pages/common/error'))
//Redirect
const TempLogin = React.lazy(() => import('pages/common/redirect'))

const TempPage = React.lazy(() => import('pages/temp'))

// const TestPage = React.lazy(() => import('pages/test_page'))

const Payment = React.lazy(() => import('pages/payment'))

const MoneyExchange = React.lazy(() => import('pages/money_exchange'))
const MoneyExchangeResult = React.lazy(() => import('pages/money_exchange_result'))
export default () => {
  return (
    <React.Suspense
      fallback={
        <div className="loading">
          <span></span>
        </div>
      }>
      <ScrollToTop />
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/after_main/" component={Main} />
        <Route exact path="/menu/:category" component={Menu} />
        <Route exact path="/rank" component={Ranking} />
        <Route exact path="/rank2" component={Ranking2} /> {/* new 랭킹 추가  */}
        <Route exact path="/rank3" component={Ranking3} /> {/* new 랭킹 추가  */}
        <Route exact path="/pay" component={Pay} />
        <Route exact path="/pay_result" component={PayResult} />
        <Route exact path="/store" component={Store} />
        <Route exact path="/charge" component={Charge} />
        <Route exact path="/charge/:path" component={Charge} />
        <Route exact path="/exchange" component={Exchange} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/password" component={Password} />
        <Route exact path="/selfauth" component={SelfAuth} />
        <Route exact path="/selfauth_result" component={SelfAuthResult} />
        <Route exact path="/mypage/:memNo" component={MyPage} />
        <Route exact path="/mypage/:memNo/:category" component={MyPage} />
        <Route exact path="/private" component={MySetting} />
        <Route exact path="/customer/" component={Customer} />
        <Route exact path="/customer/:title" component={Customer} />
        <Route exact path="/customer/:title/:num" component={Customer} />
        <Route exact path="/setting" component={Setting} />
        <Route exact path="/secession" component={Secession} />
        <Route exact path="/navigator" component={Navigator} />
        <Route exact path="/agree" component={Agree} />
        <Route exact path="/agree/:title" component={Agree} />
        {/* <Route exact path="/temp_test" component={TestPage} />
        <Route exact path="/temp_test/:path" component={TestPage} /> */}
        <Route exact path="/temp_page" component={TempPage} />
        <Route exact path="/payment" component={Payment} />
        <Route exact path="/payment/:path" component={Payment} />
        <Route exact path="/money_exchange" component={MoneyExchange} />
        <Route exact path="/money_exchange_result" component={MoneyExchangeResult} />
        <Route exact path="/event_page" component={EventPage} />
        <Route exact path="/error" component={ErrorPage} />
        <Route exact path="/redirect" component={TempLogin} />
        <Redirect to="/error" />
      </Switch>
    </React.Suspense>
  )
}
