/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import ScrollToTop from 'components/lib/ScrollToTop'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Navigator from './pages/navigator'

// import Main from 'pages/main'
const Main = React.lazy(() => import('pages/main'))
const Ranking = React.lazy(() => import('pages/ranking'))
const RankingGuide = React.lazy(() => import('pages/ranking/guide/rank_guide'))
const MyPage = React.lazy(() => import('pages/mypage'))
const Menu = React.lazy(() => import('pages/menu'))
const MySetting = React.lazy(() => import('pages/mypage/setting2.5.js'))
const Pay = React.lazy(() => import('pages/new_pay'))
const Exchange = React.lazy(() => import('pages/exchange'))
const Customer = React.lazy(() => import('pages/customer'))

const LevelInfo = React.lazy(() => import('pages/level'))
const Setting = React.lazy(() => import('pages/setting'))
const EventPage = React.lazy(() => import('pages/event_page'))
const AttendEvent = React.lazy(() => import('pages/attend_event'))
const EventRising = React.lazy(() => import('pages/event_rising'))
const Specialdj = React.lazy(() => import('pages/event_specialdj'))
const Proofshot = React.lazy(() => import('pages/event_proofshot'))
const PcOpen = React.lazy(() => import('pages/pc_open'))

const Live = React.lazy(() => import('pages/live'))
const Login = React.lazy(() => import('pages/login'))
const SignUp = React.lazy(() => import('pages/new_signup'))
const Password = React.lazy(() => import('pages/password'))
const SelfAuth = React.lazy(() => import('pages/self_auth'))
const LegalAuth = React.lazy(() => import('pages/self_auth/legal_auth'))
const SelfAuthResult = React.lazy(() => import('pages/self_auth_result'))
const Agree = React.lazy(() => import('pages/agree'))
const EventPcService = React.lazy(() => import('pages/event_pc_service'))
const Secession = React.lazy(() => import('pages/secession'))
const ErrorPage = React.lazy(() => import('pages/common/error'))
const TempLogin = React.lazy(() => import('pages/common/redirect'))
const TempPage = React.lazy(() => import('pages/temp'))

const MoneyExchange = React.lazy(() => import('pages/money_exchange'))
const MoneyExchangeResult = React.lazy(() => import('pages/money_exchange_result'))

const Service = React.lazy(() => import('pages/service'))
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
        <Route exact path="/menu/:category" component={Menu} />
        <Route exact path="/rank" component={Ranking} />
        <Route exact path="/rank/:type" component={RankingGuide} />
        <Route exact path="/event_proofshot" component={Proofshot} />
        <Route exact path="/event_specialdj" component={Specialdj} />
        <Route exact path="/event_specialdj/:title" component={Specialdj} />
        <Route exact path="/pay" component={Pay} />
        <Route exact path="/pay/:title" component={Pay} />
        <Route exact path="/exchange" component={Exchange} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/password" component={Password} />
        <Route exact path="/selfauth" component={SelfAuth} />
        <Route exact path="/legalauth" component={LegalAuth} />
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
        <Route exact path="/money_exchange_result" component={MoneyExchangeResult} />
        <Route exact path="/event_page" component={EventPage} />
        <Route exact path="/event_pc_service" component={EventPcService} />
        <Route exact path="/attend_event" component={AttendEvent} />
        <Route exact path="/attend_event/:title" component={AttendEvent} />
        <Route exact path="/event_rising" component={EventRising} />
        <Route exact path="/service" component={Service} />
        <Route exact path="/error" component={ErrorPage} />
        <Route exact path="/pc_open" component={PcOpen} />
        <Route exact path="/redirect" component={TempLogin} />
        <Redirect to="/error" />
      </Switch>
    </React.Suspense>
  )
}
