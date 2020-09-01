import React, {useState, useContext, useCallback, useEffect} from 'react'
import {useHistory, Switch, Route} from 'react-router-dom'
import {KnowHowContext} from '../store'
import Api from 'context/api'

import Attend from './attend'
import AttendAdd from './attend_add'
import AttendDetail from './attend_detail'

const KnowHowMain = () => {
  const {KnowHowState, KnowHowAction} = useContext(KnowHowContext)
  const {condition, order} = KnowHowState

  const setList = KnowHowAction.setList

  const fetchData = useCallback(async () => {
    const res = await Api.knowhow_list({
      page: 1,
      records: 100,
      slct_type: 0,
      slct_platform: condition,
      slct_order: order
    })

    if (res.result === 'success') {
      setList(res.data.list)
    }
  }, [condition, order])

  useEffect(() => {
    fetchData()
  }, [condition, order])

  return (
    <>
      <Switch>
        <Route exact path="/event_knowHow" component={Attend} />
        <Route exact path="/event_knowHow/add" component={AttendAdd} />
        <Route exact path="/event_knowHow/detail" component={AttendDetail} />
      </Switch>
    </>
  )
}

export default React.memo(KnowHowMain)
