import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import './thanksgiving.scss'
import Api from 'context/api'
import LayerPopupPay from './layer_popup_pay'
// context
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'

import Header from 'components/ui/new_header.js'

export default () => {
  let history = useHistory()
  const context = useContext(Context)
  const [myDal, setMyDal] = useState(0)
  const [payState, setPayState] = useState(false)

  const setPayPopup = () => {
    setPayState(false)
    sessionStorage.removeItem('pay_info')
  }

  const fetchGetBonus = async () => {
    const res = await Api.getChooseokBonus()

    if (res.result === 'success') {
      if (5000 <= myDal) {
        return context.action.alert({msg: '추가 보너스 250달이 지급되었습니다'})
      } else if (2000 <= myDal <= 4999) {
        return context.action.alert({msg: '추가 보너스 80달이 지급되었습니다'})
      } else if (500 <= myDal <= 1999) {
        return context.action.alert({msg: '추가 보너스 15달이 지급되었습니다'})
      } else {
        return context.action.alert({msg: res.message})
      }
    } else {
      context.action.alert({msg: res.message})
    }
  }

  const fetchMyPurchase = async () => {
    const res = await Api.getChooseokPurchase()
    if (res.result === 'success') {
      setMyDal(res.data.purchaseDal.purchaseDal)
    } else {
      context.action.alert({msg: res.message})
    }
  }

  const HandleStore = () => {
    if (context.customHeader['os'] === OS_TYPE['IOS']) {
      return webkit.messageHandlers.openInApp.postMessage('')
    } else {
      return history.push('/store?event=3')
    }
  }

  useEffect(() => {
    if (context.token.isLogin) fetchMyPurchase()
    context.action.updateSetBack(true)
    context.action.updateBackFunction({name: 'event'})
    if (sessionStorage.getItem('pay_info') !== null) {
      const payInfo = JSON.parse(sessionStorage.getItem('pay_info'))
      setPayState(payInfo)
    }
    return () => {
      context.action.updateSetBack(null)
    }
  }, [])

  useEffect(() => {
    if (!context.token.isLogin) history.push('/login?redirect=/event/thanksgiving')
  }, [context.token.isLogin])

  return (
    <>
      <div id="thxGiving">
        <div className="title">
          <h2>한가위 달 구매 이벤트</h2>
          <button
            onClick={() => {
              // history.push('/')
              window.location.href = '/'
            }}>
            닫기
          </button>
        </div>
        <img src={`${IMG_SERVER}/event/thxgiving/event_img_top.jpg`} />
        <div className="middleWrap">
          <div className="middle__inner">
            <p>
              내가 구매한 달 :
              <span>
                {myDal}
                <em>달</em>
              </span>
            </p>
            <button onClick={HandleStore}>
              <img src={`${IMG_SERVER}/event/thxgiving/btn_buy.png`} />
            </button>
          </div>
        </div>
        <img src={`${IMG_SERVER}/event/thxgiving/event_img_middle.jpg`} />
        <img src={`${IMG_SERVER}/event/thxgiving/event_img_bottom.jpg`} />
        <div className="bottomWrap">
          <button onClick={fetchGetBonus}>
            <img src={`${IMG_SERVER}/event/thxgiving/btn_bonus.png`} />
          </button>
        </div>
      </div>
      {payState && <LayerPopupPay info={payState} setPopup={setPayPopup} />}
    </>
  )
}
