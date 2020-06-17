/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import ScrollToTop from 'components/lib/ScrollToTop'

import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Navigator from './pages/navigator'

// import Main from 'pages/main'
const Main = React.lazy(() => import('pages/main'))
const NewMain = React.lazy(() => import('pages/new_main'))
const Ranking = React.lazy(() => import('pages/ranking3'))

let MyPage = React.lazy(() => import('pages/mypage'))
let Menu = React.lazy(() => import('pages/menu'))
let MySetting = React.lazy(() => import('pages/mypage/setting.js'))

/*if (__NODE_ENV !== 'real') {
  MyPage = React.lazy(() => import('pages/mypage2'))
  Menu = React.lazy(() => import('pages/menu2'))
  MySetting = React.lazy(() => import('pages/mypage2/setting2.5.js'))
}*/

const Pay = React.lazy(() => import('pages/pay'))
const PayResult = React.lazy(() => import('pages/pay_result'))
const Store = React.lazy(() => import('pages/store'))
const Charge = React.lazy(() => import('pages/charge'))
const ChargeTest = React.lazy(() => import('pages/charge/index_test'))
const Exchange = React.lazy(() => import('pages/exchange'))
const Customer = React.lazy(() => import('pages/customer'))
const LevelInfo = React.lazy(() => import('pages/level'))
const Setting = React.lazy(() => import('pages/setting'))
const Event = React.lazy(() => import('pages/event'))
const EventPage = React.lazy(() => import('pages/event_page'))
const AttendEvent = React.lazy(() => import('pages/attend_event'))

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

const MoneyExchange = React.lazy(() => import('pages/money_exchange'))
const MoneyExchangeResult = React.lazy(() =>
  import('pages/money_exchange_result')
)
export default () => {
  return (
    <React.Suspense
      fallback={
        <div className="loading">
          <span></span>
        </div>
      }
    >
      <ScrollToTop />
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/new_main" component={NewMain} />
        <Route exact path="/after_main/" component={Main} />
        <Route exact path="/menu/:category" component={Menu} />
        <Route exact path="/rank" component={Ranking} />
        {/* new 랭킹 추가  */}
        <Route exact path="/pay" component={Pay} />
        <Route exact path="/pay_result" component={PayResult} />
        <Route exact path="/store" component={Store} />
        <Route exact path="/charge_test" component={ChargeTest} />
        <Route exact path="/charge_test/:path" component={ChargeTest} />
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
        <Route exact path="/level" component={LevelInfo} />
        <Route exact path="/private" component={MySetting} />
        <Route exact path="/customer/" component={Customer} />
        <Route exact path="/customer/:title" component={Customer} />
        <Route exact path="/customer/:title/:num" component={Customer} />
        <Route exact path="/setting" component={Setting} />
        <Route exact path="/secession" component={Secession} />
        <Route exact path="/navigator" component={Navigator} />
        <Route exact path="/agree" component={Agree} />
        <Route exact path="/agree/:title" component={Agree} />
        <Route exact path="/temp_page" component={TempPage} />
        <Route exact path="/money_exchange" component={MoneyExchange} />
        <Route
          exact
          path="/money_exchange_result"
          component={MoneyExchangeResult}
        />
        <Route exact path="/event_page" component={EventPage} />
        <Route exact path="/attend_event" component={AttendEvent} />
        <Route exact path="/error" component={ErrorPage} />
        <Route exact path="/redirect" component={TempLogin} />
        <Redirect to="/error" />
      </Switch>
    </React.Suspense>
  )
}
