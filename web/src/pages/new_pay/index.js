/**
 * @auth 이은비
 * @route /pay
 * @file /pay/index.js
 * @brief 결제 index
 */

import React, {useEffect, useContext, useState, useCallback} from 'react'
import {useParams, useLocation} from 'react-router-dom'
import qs from 'query-string'

//component
import Layout from 'pages/common/layout'
import Charge from './content/charge/index'
import Result from './content/result'
import RoomCharge from './content/room_charge'
import StoreCharge from './content/store_charge'
import BankDeposit from './content/charge/bank_deposit'
import BankWait from './content/charge/bank_deposit_wait'

////---------------------------------------------------------------------
export default () => {
  const params = useParams()
  const location = useLocation()

  const {webview, canceltype, tabType} = qs.parse(location.search)

  const [selected, setSelected] = useState({
    num: 3,
    name: '달 300',
    price: 33000,
    itemNo: 'A1555',
    event: 0
  })

  const createContent = useCallback(() => {
    let {title} = params
    const {state} = location

    if (state === undefined && Object.keys(params).length === 0 /*&& webview === 'new'*/) {
      title = 'room'
    }
    if ((state !== undefined && state.hasOwnProperty('result')) || canceltype) {
      title = 'result'
    }
    switch (title) {
      case 'charge':
        return <Charge />
      case 'result':
        return <Result />
      case 'room':
        return <RoomCharge tabType={tabType} />
      case 'store':
        return <StoreCharge selected={selected} setSelected={setSelected} />
      case 'bank':
        return <BankDeposit />
      case 'bank_wait':
        return <BankWait />
      default:
        return <></>
        break
    }
  }, [selected, params, location])
  return <Layout status="no_gnb">{createContent()}</Layout>
}
