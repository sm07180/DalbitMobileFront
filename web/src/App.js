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
import User from 'Pages/user' //유저 (회원가입,회원정보입력등)
//
export default () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/user" component={User} />
      <Route exact path="/guide/" component={Guide} />
    </Switch>
  )
}
