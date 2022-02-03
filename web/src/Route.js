/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import ScrollToTop from 'components/lib/ScrollToTop'
import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Navigator from './pages/navigator'

import Message from 'pages/common/message'

import Common from "common";
import Modal from "common/modal";
import Alert from "common/alert";

// import Main from 'pages/main'
const Main = React.lazy(() => import('pages/main'))

const Clip = React.lazy(() => import('pages/reclip'))
const ClipDetail = React.lazy(() => import('pages/reclip/contents/clipDetail'))

const Ranking = React.lazy(() => import('pages/reranking'))
const RankingDetail = React.lazy(() => import('pages/reranking/contents/rankingDetail'))

const MyPage = React.lazy(() => import('pages/remypage'))

const ReSearch = React.lazy(() => import('pages/research'))

const ReSetting = React.lazy(() => import('pages/resetting'))

const Menu = React.lazy(() => import('pages/menu'))
const MySetting = React.lazy(() => import('pages/mysetting'))

const Store = React.lazy(() => import('pages/restore'))

const Pay = React.lazy(() => import('pages/new_pay'))
const Exchange = React.lazy(() => import('pages/reExchange'))
const Customer = React.lazy(() => import('pages/customer'))
const ImageEditor = React.lazy(() => import('pages/common/imageEditor'))
const Event = React.lazy(() => import('pages/event'))

const ClipReply = React.lazy(() => import('pages/clip_reply'))
const ClipTip = React.lazy(() => import('pages/clip/fileload_tip'))
const LevelInfo = React.lazy(() => import('pages/level'))
const Setting = React.lazy(() => import('pages/setting'))
const EventPage = React.lazy(() => import('pages/event_page'))
const EventPcService = React.lazy(() => import('pages/event_pc_service'))
const AttendEvent = React.lazy(() => import('pages/attend_event'))
const EventRising = React.lazy(() => import('pages/event_rising'))
const Proofshot = React.lazy(() => import('pages/event_proofshot'))
const Package = React.lazy(() => import('pages/event_package'))
const EventKnowHow = React.lazy(() => import('pages/event_know_how'))
const PcOpen = React.lazy(() => import('pages/pc_open'))
const ClipOpen = React.lazy(() => import('pages/clip_open'))
const ClipPlayList = React.lazy(() => import('pages/clip_play_list'))
const ClipRecommend = React.lazy(() => import('pages/clip/components/clip_recommend'))
const ClipRank = React.lazy(() => import('pages/clip_rank'))
const ClipRankGuide = React.lazy(() => import('pages/clip_rank/components'))
const Live = React.lazy(() => import('pages/live'))

const Login = React.lazy(() => import('pages/login'))
const LoginSns = React.lazy(() => import('pages/login/contents/loginSns'))
const LoginForm = React.lazy(() => import('pages/login/contents/LoginForm'))

const SignUp = React.lazy(() => import('pages/resignup'))
const Password = React.lazy(() => import('pages/password'))
const SelfAuth = React.lazy(() => import('pages/self_auth'))
const LegalAuth = React.lazy(() => import('pages/self_auth/legal_auth'))
const SelfAuthResult = React.lazy(() => import('pages/self_auth_result'))
const Agree = React.lazy(() => import('pages/agree'))

const Secession = React.lazy(() => import('pages/secession'))
const ErrorPage = React.lazy(() => import('pages/common/error'))
const TempLogin = React.lazy(() => import('pages/common/redirect'))
const TempPage = React.lazy(() => import('pages/temp'))

const MoneyExchange = React.lazy(() => import('pages/remoneyExchange'))
const MoneyExchangeResult = React.lazy(() => import('pages/money_exchange_result'))

const Service = React.lazy(() => import('pages/service'))
const NoService = React.lazy(() => import('pages/no_service'))

const Story = React.lazy(() => import('pages/story'))




const ClipRecoding = React.lazy(() => import("pages/clip_recoding"));
const ClipUpload = React.lazy(() => import("pages/clip_recoding/upload"));
const ClipPlayer = React.lazy(() => import("pages/clip_player"));

const Broadcast =  React.lazy(() => import("pages/broadcast/index"))
const BroadcastSetting =  React.lazy(() => import("pages/broadcast_setting/index"))
const Mailbox = React.lazy(() => import("pages/mailbox"));
const MoveToAlert = React.lazy(() => import( "common/alert/MoveToAlert"));

const Router = () => {
  return (
    <React.Suspense fallback={false}>
      <Common />
      <ScrollToTop />
      <Message />
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/menu/:category" component={Menu} />
        <Route exact path="/search" component={ReSearch} />
        
        <Route exact path="/rank" component={Ranking} />
        <Route exact path="/rank/:type" component={RankingDetail} />

        <Route exact path="/setting" component={ReSetting} />
        <Route exact path="/setting/:type" component={ReSetting} />
        
        <Route exact path="/event/:title" component={Event} />
        <Route exact path="/event/:title/:type" component={Event} />

        <Route exact path="/store" component={Store} />

        <Route exact path="/pay" component={Pay} />
        <Route exact path="/pay/:title" component={Pay} />
        <Route exact path="/exchange" component={Exchange} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/login/sns" component={LoginSns} />
        <Route exact path="/login/form" component={LoginForm} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/password" component={Password} />
        <Route exact path="/selfauth" component={SelfAuth} />
        <Route exact path="/legalauth" component={LegalAuth} />
        <Route exact path="/selfauth_result" component={SelfAuthResult} />
        <Route exact path="/mypage/:memNo" component={MyPage} />
        <Route exact path="/mypage/:memNo/:category" component={MyPage} />
        <Route exact path="/mypage/:memNo/:category/:addpage" component={MyPage} />
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
        <Route exact path="/no_service" component={NoService} />
        <Route exact path="/error" component={ErrorPage} />
        <Route exact path="/pc_open" component={PcOpen} />
        <Route exact path="/clip_open" component={ClipOpen} />
        <Route exact path="/clip" component={Clip} />
        <Route exact path="/clip/detail" component={ClipDetail} />
        <Route exact path="/clip_rank" component={ClipRank} />
        <Route exact path="/clip_rank/:type" component={ClipRankGuide} />
        <Route exact path="/clip_recommend" component={ClipRecommend} />
        <Route exact path="/redirect" component={TempLogin} />
        <Route exact path="/clip/tip" component={ClipTip} />
        <Route exact path="/redirect" component={TempLogin} />
        <Route exact path="/clip/:clipNo/reply" component={ClipReply} />
        <Route exact path="/clip/play_list" component={ClipPlayList} />
        <Route exact path="/ImageEditor" component={ImageEditor} />
        <Route exact path="/story" component={Story} />
        <Route exact path="/story/:roomNo" component={Story} />

        {/*  www 클립 라우터  */}
        <Route exact path="/clip_recoding" component={ClipRecoding}  />
        <Route exact path="/clip_upload" component={ClipUpload} />
        <Route exact path="/clip/:clipNo" component={ClipPlayer} />

        {/*  www 방송 청취 및 세팅  */}
        <Route exact path="/broadcast/:roomNo" component={Broadcast} />
        <Route exact path="/broadcast_setting" component={BroadcastSetting} />

        {/*  www 우체통관련  */}
        <Route exact path="/mailbox" component={Mailbox} />
        <Route exact path="/mailbox/:category" component={Mailbox} />
        <Route exact path="/mailbox/:category/:mailNo" component={Mailbox} />

        <Route path="/modal/:type" component={Modal} />
        <Redirect to="/error" />
      </Switch>
      <Alert />
      <MoveToAlert />
    </React.Suspense>
  )
};
export default Router
