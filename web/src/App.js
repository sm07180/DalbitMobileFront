/**
 * @file index.js
 * @brief Router 목록들
 * @notice React Router에 관해서 Back-End쪽에서 허용처리가 필요함, 추가될때마다 요청필요.
 */
import React from 'react'
import {Route, Switch} from 'react-router-dom'
//pages

/*-common-*/
import Main from 'Pages/main' //메인
import Guide from 'Pages/guide/' //가이드
import Login from 'Pages/login/' //로그인
import User from 'Pages/user' //유저 (회원가입,회원정보입력등)
import Live from 'Pages/live' //라이브
import Mypage from 'Pages/mypage' //마이페이지
import Cast from 'Pages/cast' //캐스트
/*-app-*/
import App from 'Pages/app' //라이브
//
export default () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/cast" component={Cast} />
      <Route exact path="/user" component={User} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/live" component={Live} />
      <Route exact path="/guide/" component={Guide} />
      <Route exact path="/mypage/" component={Mypage} />
      <Route exact path="/app/" component={App} />
    </Switch>
  )
}
