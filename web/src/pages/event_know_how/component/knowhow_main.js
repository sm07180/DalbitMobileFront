import React, {useContext, useCallback, useEffect} from 'react'
import {Switch, Route} from 'react-router-dom'
import {Context} from 'context'
import {KnowHowContext} from '../store'
import Api from 'context/api'

import Attend from './attend'
import AttendAdd from './attend_add'
import AttendDetail from './attend_detail'

const KnowHowMain = () => {
  const context = useContext(Context)
  const {KnowHowState, KnowHowAction} = useContext(KnowHowContext)
  const {condition, order, mine} = KnowHowState

  const setList = KnowHowAction.setList
  const setMyCnt = KnowHowAction.setMyCnt
  const fetchData = useCallback(async () => {
    const res = await Api.knowhow_list({
      page: 1,
      records: 10000,
      slct_type: mine,
      slct_platform: condition,
      slct_order: order
    })

    if (res.result === 'success') {
      setList(res.data.list)
      setMyCnt(res.data.myCnt)
    }
  }, [condition, order, mine, context.token])

  useEffect(() => {
    fetchData()
  }, [condition, order, mine, context.token])

  return (
    <>
      <Switch>
        <Route exact path="/event_knowHow" component={Attend} />
        <Route exact path="/event_knowHow/add" component={AttendAdd} />
        <Route exact path="/event_knowHow/add/:num" component={AttendAdd} />
        <Route exact path="/event_knowHow/detail/:num" component={AttendDetail} />
      </Switch>
    </>
  )
}

export default React.memo(KnowHowMain)
