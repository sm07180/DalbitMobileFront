/**
 * @file Notice.js
 * @brief 고객센터 공지사항 컨텐츠
 *
 */
import React, {useState, useContext, useEffect} from 'react'
import {Switch, Route} from 'react-router-dom'

import Detail from './detail'
import List from './list'

export default function Notice() {
  return (
    <Switch>
      <Route path="/customer/notice" exact component={List}></Route>
      <Route path="/customer/notice/:number" exact component={Detail}></Route>
    </Switch>
  )
}
