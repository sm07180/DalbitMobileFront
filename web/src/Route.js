/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import React ,{ Suspense, lazy } from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
//pages

/*-common-*/
// import Main from 'pages/main' //메인
// import BroadCast from 'pages/broadcast' //메인
// import BroadCastSetting from 'pages/broadcast-setting' //메인
// import Guide from 'pages/guide/' //가이드
// import Login from 'pages/login/' //로그인
// import User from 'pages/user' //유저 (회원가입,회원정보입력등)
// import Cast from 'pages/cast' //로그인
// import Live from 'pages/live' //라이브
// import Store from 'pages/store' //스토어
// import Event from 'pages/event' //이벤트
// import Mypage from 'pages/mypage' //마이페이지
// import Search from 'pages/search' //검색
// import NotFoundPage from 'pages/common/404' //404 페이지없을경우
// /*-app-*/
// import App from 'pages/app' //라이브

/* :title  
/user/join 회원가입 
/user/password 비밀번호찾기
*/
const Main = React.lazy(() => import('pages/main'));
const BroadCast = React.lazy(() => import('pages/broadcast'));
const BroadCastSetting = React.lazy(() => import('pages/broadcast-setting'));
const Guide = React.lazy(() => import('pages/guide'));
const Login = React.lazy(() => import('pages/login'));
const User = React.lazy(() => import('pages/user'));
const Cast = React.lazy(() => import('pages/cast'));
const Live = React.lazy(() => import('pages/live'));
const Store = React.lazy(() => import('pages/store'));
const Event = React.lazy(() => import('pages/event'));
const Mypage = React.lazy(() => import('pages/mypage'));
const Search = React.lazy(() => import('pages/search'));
const NotFoundPage = React.lazy(() => import('pages/common/404'));
const App = React.lazy(() => import('pages/app'));


// const Main = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/main'
// ));

// const BroadCast = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/broadcast'
// ));
// const BroadCastSetting = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/broadcast-setting'
// ));
// const Guide = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/guide'
// ));
// const User = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/user'
// ));
// const Login = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/login'
// ));
// const Live = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/live'
// ));
// const Store = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/store'
// ));
// const Event = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/event'
// ));
// const Mypage = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/mypage'
// ));
// const App = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/app'
// ));
// const Search = lazy(() => import(
// 	/* webpackChunkName: "my-chunk-name" */
// 	/* webpackPrefetch: true */
// 	'pages/search'
// ));
export default () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/broadcast" component={BroadCast} />
        <Route exact path="/broadcast-setting" component={BroadCastSetting} />
        <Route exact path="/broadcast/:title" component={BroadCast} />
        <Route exact path="/cast" component={BroadCast} />
        <Route exact path="/user" component={User} />
        <Route exact path="/user/:title" component={User} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/store" component={Store} />
        <Route exact path="/event" component={Event} />
        <Route path="/guide" component={Guide} />
        <Route exact path="/mypage/" component={Mypage} />
        <Route exact path="/app/" component={App} />
        <Route exact path="/search" component={Search} />
        {/* 페이지가없을경우 404로 이동 */}
        <Route path="/404" component={NotFoundPage} />
        <Redirect to="/404" />
      </Switch>
    </React.Suspense>
  )
}
