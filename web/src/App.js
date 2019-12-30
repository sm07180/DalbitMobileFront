import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
//pages

/*-common-*/
import Main from './pages/main' //메인
import Guide from './pages/guide/' //가이드

export default () => {
  return (
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/guide/" component={Guide} />
    </Switch>
  )
}
