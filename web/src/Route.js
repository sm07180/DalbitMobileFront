/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import React from 'react'
import {Route, Redirect, Switch} from 'react-router-dom'
//pages

/*-common-*/
import Main from 'pages/main' //메인
import BroadCast from 'pages/broadcast' //메인
import Guide from 'pages/guide/' //가이드
import Login from 'pages/login/' //로그인
import User from 'pages/user' //유저 (회원가입,회원정보입력등)
import Cast from 'pages/cast' //로그인
import Live from 'pages/live' //라이브
import Store from 'pages/store' //스토어
import Event from 'pages/event' //이벤트
import Mypage from 'pages/mypage' //마이페이지
import NotFoundPage from 'pages/common/404' //404 페이지없을경우
/*-app-*/
import App from 'pages/app' //라이브
//
/* :title  
/user/join 회원가입 
/user/password 비밀번호찾기
*/
export default () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/broadcast" component={BroadCast} />
      <Route exact path="/cast" component={Cast} />
      <Route exact path="/user" component={User} />
      <Route exact path="/user/:title" component={User} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/live" component={Live} />
      <Route exact path="/store" component={Store} />
      <Route exact path="/event" component={Event} />
      <Route path="/guide" component={Guide} />
      <Route exact path="/mypage/" component={Mypage} />
      <Route exact path="/app/" component={App} />
      {/* 페이지가없을경우 404로 이동 */}
      <Route path="/404" component={NotFoundPage} />
      {/* <Redirect to="/404" /> */}
    </Switch>
  )
}
