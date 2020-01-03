/**
 * @file index.js
 * @brief Router 목록들
 */
import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
//pages

/*-common-*/
import Main from 'Pages/main' //메인
import Guide from 'Pages/guide/' //가이드

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/guide/" component={Guide} />
    </Switch>
  )
}
