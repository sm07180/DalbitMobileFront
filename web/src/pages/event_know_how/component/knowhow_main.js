import React, {useCallback, useContext, useEffect} from 'react'
import {Route, Switch} from 'react-router-dom'
import {KnowHowContext} from '../store'
import Api from 'context/api'

import Attend from './attend'
import AttendAdd from './attend_add'
import AttendDetail from './attend_detail'
import {useDispatch, useSelector} from "react-redux";

const KnowHowMain = () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);
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
  }, [condition, order, mine, globalState.token])

  useEffect(() => {
    fetchData()
  }, [condition, order, mine, globalState.token])

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
