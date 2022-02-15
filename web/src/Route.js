/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import ScrollToTop from 'components/lib/ScrollToTop'
import React, {useContext} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import Navigator from './pages/navigator'

import Popup from 'components/ui/popup'

import Common from "common";
import Modal from "common/modal";
import Alert from "common/alert";
import {Context} from "context";
import {route} from "express/lib/router";

// import Main from 'pages/main'
//----- dalla -----//
const Main = React.lazy(() => import('pages/main'))
// 모바일 웹
const MobileWeb = React.lazy(() => import('pages/mobileWeb'))
// 이벤트 모음 Zip
const EventZip = React.lazy(() => import('pages/eventzip'))

// 클립
const Clip = React.lazy(() => import('pages/clip'));
const ClipDetail = React.lazy(() => import('pages/clip/detail'));
const ClipLikeList = React.lazy(() => import('pages/clip/like'));
const ClipListenList = React.lazy(() => import('pages/clip/listen'));
const ClipRank = React.lazy(() => import('pages/reclip/contents/rank/ClipRanking'))
const ClipRankGuide = React.lazy(() => import('pages/reclip/contents/rank/ClipRankingGuide'))

// 랭킹
const Ranking = React.lazy(() => import('pages/reranking'))
const RankingDetail = React.lazy(() => import('pages/reranking/contents/rankingDetail'))
const RankingBenefit = React.lazy(() => import('pages/reranking/contents/RankingBenefit'))
const RankingGuide = React.lazy(() => import('pages/ranking_renewal/components/guide/rank_guide'))

// 마이페이지
const MyPage = React.lazy(() => import('pages/remypage'))
// 검색
const ReSearch = React.lazy(() => import('pages/research'))
// 셋팅
const ReSetting = React.lazy(() => import('pages/resetting'))
// 명예의 전당
const ReHonor = React.lazy(() => import('pages/rehonor'))
// 고객센터
const ReCustomer = React.lazy(() => import('pages/recustomer/Customer'))


// 프로필
const Profile = React.lazy(() => import('pages/profile'))
// 프로필 수정
const ProfileEdit = React.lazy(() => import('pages/profile/contents/profileEdit/profileEdit'))
// 프로필 - 피드, 팬보드 (작성, 수정)
const ProfileContentsWrite = React.lazy(() => import('pages/profile/contents/profileDetail/profileWrite'))
// 프로필 - 피드, 팬보드 (상세)
const ProfileDetail = React.lazy(() => import('pages/profile/contents/profileDetail/profileDetail'))
// 스토어
const Store = React.lazy(() => import('pages/store'))
const DalCharge= React.lazy(() => import('pages/store/contents/dalCharge/dalCharge'))
const Coocon = React.lazy(() => import('pages/store/contents/bankTransfer/bankTransfer'))
const CooconResult = React.lazy(() => import('pages/store/contents/bankTransfer/bankResult'))
const PayEnd = React.lazy(() => import('pages/store/contents/end/End'))
const PayEndApp = React.lazy(() => import('pages/store/contents/end/EndApp'))
const Receipt = React.lazy(() => import('pages/store/contents/end/receipt'))
// 내지갑
const Wallet = React.lazy(() => import('pages/rewallet'))
const ExchangeDal = React.lazy(() => import('pages/rewallet/contents/exchange/ExchangeDal'))
const ExchangeResult = React.lazy(() => import('pages/rewallet/contents/exchange/ExchangeResult'))
// 로그인
const Login = React.lazy(() => import('pages/login'))
const LoginStart = React.lazy(() => import('pages/login/contents/start'))
const DidLogin = React.lazy(() => import('pages/login/contents/didLogin'))
// 회원가입
const SignUp = React.lazy(() => import('pages/signup'))
const SocialSignUp = React.lazy(() => import('pages/signup/socialSignUp'))
//----- dalla -----//

const Menu = React.lazy(() => import('pages/menu'))
const MySetting = React.lazy(() => import('pages/mysetting'))
const Exchange = React.lazy(() => import('pages/reExchange'))
const MoneyExchange = React.lazy(() => import('pages/remoneyExchange'))

const Pay = React.lazy(() => import('pages/new_pay'))
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
const Live = React.lazy(() => import('pages/live'))


const Password = React.lazy(() => import('pages/password'))
const SelfAuth = React.lazy(() => import('pages/self_auth'))
const LegalAuth = React.lazy(() => import('pages/self_auth/legal_auth'))
const SelfAuthResult = React.lazy(() => import('pages/self_auth_result'))
const Agree = React.lazy(() => import('pages/agree'))

const Secession = React.lazy(() => import('pages/secession'))
const ErrorPage = React.lazy(() => import('pages/common/error'))
const TempLogin = React.lazy(() => import('pages/common/redirect'))
const TempPage = React.lazy(() => import('pages/temp'))

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

const Notice = React.lazy(() => import("pages/remypage/contents/notice/Notice"));
const PostDetail = React.lazy(() => import("pages/remypage/contents/notice/PostDetail"));
const Report = React.lazy(() => import("pages/remypage/contents/report/Report"));

const Router = () => {
  const context = useContext(Context);
  return (
    <React.Suspense
      fallback={
        <div className="loading">
          <span></span>
        </div>
      }>
      <ScrollToTop />
      <Popup />
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/menu/:category" component={Menu} />
        <Route exact path="/search" component={ReSearch} />

        <Route exact path="/mobileWeb" component={MobileWeb} />

        <Route exact path="/eventzip" component={EventZip} />

        <Route exact path="/rank" component={Ranking} />
        <Route exact path="/rankDetail/:type" component={RankingDetail} />
        <Route exact path="/rank/benefit" component={RankingBenefit} />
        {/* <Route exact path="/rank/:type" component={RankingGuide} /> */}

        <Route exact path="/setting" component={ReSetting} />
        <Route exact path="/setting/:type" component={ReSetting} />
        <Route exact path="/setting/:type/:category" component={ReSetting} />

        <Route exact path="/honor" component={ReHonor} />

        <Route exact path="/event/:title" component={Event} />
        <Route exact path="/event/:title/:type" component={Event} />

        <Route exact path="/store" component={Store} />
        <Route exact path="/store/dalcharge" component={DalCharge} />
        <Route exact path="/pay/bank" component={Coocon}/>
        <Route exact path="/pay/bankInfo" component={CooconResult}/>
        <Route exact path="/pay/end" component={PayEnd}/>
        <Route exact path="/pay/end/app" component={PayEndApp}/>
        <Route exact path="/pay/receipt" component={Receipt}/>

        <Route exact path="/wallet" component={Wallet} />
        <Route exact path="/wallet/exchangedal" component={ExchangeDal} />
        <Route exact path="/wallet/result" component={ExchangeResult} />

        <Route exact path="/pay" component={Pay} />
        <Route exact path="/pay/:title" component={Pay} />
        <Route exact path="/exchange" component={Exchange} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/login" component={Login}/>
        <Route exact path="/login/start" component={LoginStart} />
        <Route exact path="/login/didLogin" component={DidLogin} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/socialSignUp" component={SocialSignUp} />
        <Route exact path="/password" component={Password} />
        <Route exact path="/selfauth" component={SelfAuth} />
        <Route exact path="/legalauth" component={LegalAuth} />
        <Route exact path="/selfauth_result" component={SelfAuthResult} />
        <Route exact path="/mypage" component={MyPage} />
        <Route exact path="/mypage/:memNo" main={MyPage}
               render={() => <Redirect to={{ pathname: '/mypage' }} />}
        />
        <Route exact path={"/myProfile/edit"} component={ProfileEdit}/>
        <Route exact path="/myProfile/:webView?/:tab?" component={Profile} />
        <Route exact path="/profile/:memNo/:webView?/:tab?" main={Profile}
               render={({location, match}) => {
                 const myMemNo = context.profile.memNo;
                 const targetMemNo = match.params.memNo
                 const searchData = location.search
                 if(myMemNo === targetMemNo) {
                   return <Redirect to={{ pathname: `/myProfile${searchData ? `/${searchData}` : ''}` }} />
                 }else {
                   return <Route component={Profile} />
                 }
               }}
        />
        {/*피드, 팬보드 등록*/}
        <Route exact path={"/profileWrite/:memNo/:type/:action"} main={ProfileContentsWrite}
               render={({ match}) => {
                 const myMemNo = context.profile.memNo;
                 const {memNo, type, action} = match.params;
                 if(!context.token?.isLogin){
                   return <Redirect to={{ pathname: '/login' }} />
                 } else if((type ==='feed' && myMemNo !== memNo) || action === 'modify'){
                   return <Redirect to={{ pathname: '/myProfile' }} />
                 }
                  return <Route component={ProfileContentsWrite} />
               }}
        />
        {/*피드, 팬보드 수정*/}
        <Route exact path={"/profileWrite/:memNo/:type/:action/:index"} main={ProfileContentsWrite}
               render={({ match}) => {
                 const myMemNo = context.profile.memNo;
                 const {memNo, type, action} = match.params;
                 if(!context.token?.isLogin){
                   return <Redirect to={{ pathname: '/login' }} />
                 } else if(myMemNo !== memNo || action === 'write'){
                   return <Redirect to={{ pathname: '/myProfile' }} />
                 }
                   return <Route component={ProfileContentsWrite} />
               }}
        />
        {/*피드 조회*/}
        <Route exact path={"/profileDetail/:memNo/:type/:index"} main={ProfileDetail}
               render={({ match}) => {
                 const {memNo, type, index} = match.params;

                 if(!context.token?.isLogin){

                   return <Redirect to={{ pathname: '/login', search:`?redirect=/profileDetail/${memNo}/${type}/${index}` }} />
                 } else {
                   return <Route component={ProfileDetail} />
                 }
               }}
        />

        <Route exact path={"/myProfile/edit"} component={ProfileEdit}/>
        {/*<Route exact path="/mypage/:memNo/:category" component={MyPage} />*/}
        {/*<Route exact path="/mypage/:memNo/:category/:addpage" component={MyPage} />*/}
        {/*<Route exact path="/profile/:memNo" component={Profile} />*/}


        {/*<Route exact path="/profile/:memNo/write" component={ProfileWrite} />*/}

        <Route exact path="/level" component={LevelInfo} />
        <Route exact path="/private" component={MySetting} />
        <Route exact path="/customer/" component={ReCustomer} />
        <Route exact path="/customer/:title" component={ReCustomer} />
        <Route exact path="/customer/:title/:num" component={ReCustomer} />
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
        <Route exact path="/clip/like/list" component={ClipLikeList}/>
        <Route exact path="/clip/listen/list" component={ClipListenList}/>
        <Route exact path="/clip/detail/:type" component={ClipDetail} />
        <Route exact path="/clip_rank" component={ClipRank} />
        <Route exact path="/clip_rank/reward" component={ClipRankGuide} />
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

        <Route exact path="/notice" component={Notice} />
        <Route exact path="/notice/:num" component={PostDetail} />
        <Route exact path="/report" component={Report} />

        <Route path="/modal/:type" component={Modal} />
        <Redirect to="/error" />
      </Switch>
    </React.Suspense>
  );
};

export default Router;
