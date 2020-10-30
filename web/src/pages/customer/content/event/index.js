import React from 'react'
import {Switch, Route} from 'react-router-dom'

import List from './event_list'
import EventWinner from './event_winner'
import WinnerInfo from './winner_info'
import WinnerInfoForm from './winner_info_form'

import './event_list.scss'

export default function Event() {
  return (
    <Switch>
      <Route path="/customer/event" exact component={List}></Route>
      <Route path="/customer/event/winnerInfo" exact component={WinnerInfo}></Route>
      <Route path="/customer/event/winner_info_form" exact component={WinnerInfoForm}></Route>
      <Route path="/customer/event/:number" exact component={EventWinner}></Route>
    </Switch>
  )
}
