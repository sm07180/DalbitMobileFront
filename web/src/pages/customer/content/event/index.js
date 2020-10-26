import React from 'react'
import {Switch, Route} from 'react-router-dom'

import List from './list'
import EventWinner from './eventWinner'
import WinnerInfo from './winnerInfo'
import WinnerInfoForm from './winnerInfoForm'

export default function Event() {
    return (
        <Switch>
            <Route path="/customer/event" exact component={List}></Route>
            <Route path="/customer/event/winnerInfo" exact component={WinnerInfo}></Route>
            <Route path="/customer/event/winnerInfoForm" exact component={WinnerInfoForm}></Route>
            <Route path="/customer/event/:number" exact component={EventWinner}></Route>
        </Switch>
    )
}