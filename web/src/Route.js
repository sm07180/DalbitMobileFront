/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
//
import Navigator from './pages/navigator'
/**
 * 하이브리드 앱연동을 문제발생,lazy로딩 x
 */

//const Login = React.lazy(() => import('pages/login'))
/* :title  
/user/join 회원가입 
/user/password 비밀번호찾기
*/
//pages
/*-common-*/
const Main = React.lazy(() => import('pages/main'))
const BroadCast = React.lazy(() => import('pages/broadcast'))
const BroadCastSetting = React.lazy(() => import('pages/broadcast-setting'))
const Guide = React.lazy(() => import('pages/guide'))
const Login = React.lazy(() => import('pages/login'))
const User = React.lazy(() => import('pages/user'))
const Cast = React.lazy(() => import('pages/cast'))
const Ranking = React.lazy(() => import('pages/ranking'))
const Live = React.lazy(() => import('pages/live'))
const Store = React.lazy(() => import('pages/store'))
const Event = React.lazy(() => import('pages/event'))
const Mypage = React.lazy(() => import('pages/mypage'))
const Search = React.lazy(() => import('pages/search'))
const NotFoundPage = React.lazy(() => import('pages/common/404'))
// import App from 'pages/app' //라이브
const App = React.lazy(() => import('pages/app'))

export default () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/broadcast" component={BroadCast} />
        <Route exact path="/broadcast-setting" component={BroadCastSetting} />
        <Route exact path="/broadcast/:title" component={BroadCast} />
        <Route exact path="/cast" component={Cast} />
        <Route exact path="/ranking" component={Ranking} />
        <Route exact path="/user" component={User} />
        <Route exact path="/user/:title" component={User} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/live" component={Live} />
        <Route exact path="/store" component={Store} />
        <Route exact path="/event" component={Event} />
        <Route path="/guide" component={Guide} />
        <Route exact path="/mypage/" component={Mypage} />
        <Route exact path="/mypage/:sub" component={Mypage} />
        <Route exact path="/app/" component={App} />
        <Route exact path="/search" component={Search} />
        {/* navigator */}
        <Route exact path="/navigator" component={Navigator} />
        {/* 페이지가없을경우 404로 이동 */}
        <Route path="/404" component={NotFoundPage} />
        <Redirect to="/404" />
      </Switch>
    </React.Suspense>
  )
}
