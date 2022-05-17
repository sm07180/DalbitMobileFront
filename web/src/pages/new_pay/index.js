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
import BankInfo from './content/charge/bank_info'

////---------------------------------------------------------------------
export default () => {
  const params = useParams()
  const location = useLocation()

  const {webview, canceltype, tabType} = qs.parse(location.search)

  const [selected, setSelected] = useState({
    num: 1,
    name: '달 100',
    price: 11000,
    itemNo: 'A1335',
    event: 0
  })

  const androidClosePopup = () => {
    Hybrid('CloseLayerPopup')
    Hybrid('ClosePayPopup')
  }

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
        return <Charge roomSelected={selected} setRoomSelected={setSelected} />
      case 'result':
        return <Result selected={selected} />
      case 'room':
        return <RoomCharge tabType={tabType} setRoomSelected={setSelected} />
      case 'store':
        return <StoreCharge selected={selected} setSelected={setSelected} />
      case 'bank':
        return <BankDeposit />
      case 'bank_wait':
        return <BankWait />
      case 'bank_info':
        return <BankInfo />
      default:
        return <></>
        break
    }
  }, [selected, params, location])

  return <Layout status="no_gnb">
    {createContent()}

    </Layout>
}
