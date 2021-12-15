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
import GganbuReward from '../event/gganbu/content/gganbuReward';

////---------------------------------------------------------------------
export default () => {
  const params = useParams()
  const location = useLocation()

  const {webview, canceltype, tabType} = qs.parse(location.search)
  const [rewardPop, setRewardPop] = useState(false)
  const [getMarble, setGetMarble] = useState({
    rmarbleCnt : 0,
    ymarbleCnt : 0,
    bmarbleCnt : 0,
    vmarbleCnt : 0,
    totalmarbleCnt : 0,
  });
  
  const [chargeContent, setChargeContent] = useState("");

  const [selected, setSelected] = useState({
    num: 3,
    name: '달 300',
    price: 33000,
    itemNo: 'A1555',
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
        return <Charge />
      case 'result':
        return <Result location={location} setRewardPop={setRewardPop} setGetMarble={setGetMarble} setChargeContent={setChargeContent} />
      case 'room':
        return <RoomCharge tabType={tabType} />
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
    
    {rewardPop &&
     <GganbuReward setRewardPop={setRewardPop} getMarble={getMarble} content={chargeContent} androidClosePopup={androidClosePopup}
    />}
    </Layout>
}
