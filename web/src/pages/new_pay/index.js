/**
 * @auth 이은비
 * @route /pay
 * @file /pay/index.js
 * @brief 결제 index
 */

import React, {useEffect, useContext, useState} from 'react'
import {useParams, useLocation} from 'react-router-dom'
import qs from 'query-string'

//component
import Layout from 'pages/common/layout'
import Charge from './content/charge/index'
import Result from './content/result'
import RoomCharge from './content/room_charge'
import StoreCharge from './content/store_charge'

////---------------------------------------------------------------------
export default () => {
  const params = useParams()
  const location = useLocation()

  const {webview} = qs.parse(location.search)

  const createContent = () => {
    let {title} = params
    const {state} = location
    const {name, price, itemNo} = location.search
    if (state === undefined && Object.keys(params).length === 0 /*&& webview === 'new'*/) {
      title = 'room'
    }
    if (state !== undefined && state.hasOwnProperty('result')) {
      title = 'result'
    }
    switch (title) {
      case 'charge':
        return <Charge />
      case 'result':
        return <Result />
      case 'room':
        return <RoomCharge />
      case 'store':
        return <StoreCharge />
      default:
        return <></>
        break
    }
  }
  return <Layout status="no_gnb">{createContent()}</Layout>
}