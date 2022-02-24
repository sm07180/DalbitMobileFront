import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import './thanksgiving.scss'
import Api from 'context/api'
import LayerPopupPay from './layer_popup_pay'
// context
import {OS_TYPE} from 'context/config.js'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxBackFunction, setGlobalCtxBackState, setGlobalCtxMessage} from "redux/actions/globalCtx";

export default () => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  let history = useHistory()
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
        return dispatch(setGlobalCtxMessage({type: "alert", msg: '추가 보너스 250달이 지급되었습니다'}))
      } else if (2000 <= myDal <= 4999) {
        return dispatch(setGlobalCtxMessage({type: "alert", msg: '추가 보너스 80달이 지급되었습니다'}))
      } else if (500 <= myDal <= 1999) {
        return dispatch(setGlobalCtxMessage({type: "alert", msg: '추가 보너스 15달이 지급되었습니다'}))
      } else {
        return dispatch(setGlobalCtxMessage({type: "alert", msg: res.message}))
      }
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", msg: res.message}))
    }
  }

  const fetchMyPurchase = async () => {
    const res = await Api.getChooseokPurchase()
    if (res.result === 'success') {
      setMyDal(res.data.purchaseDal.purchaseDal)
    } else {
      dispatch(setGlobalCtxMessage({type: "alert", msg: res.message}))
    }
  }

  const HandleStore = () => {
    if (globalState.customHeader['os'] === OS_TYPE['IOS']) {
      return webkit.messageHandlers.openInApp.postMessage('')
    } else {
      return history.push('/store?event=3')
    }
  }

  useEffect(() => {
    if (globalState.token.isLogin) fetchMyPurchase()
    dispatch(setGlobalCtxBackState(true))
    dispatch(setGlobalCtxBackFunction({name: 'event'}))
    if (sessionStorage.getItem('pay_info') !== null) {
      const payInfo = JSON.parse(sessionStorage.getItem('pay_info'))
      setPayState(payInfo)
    }
    return () => {
      dispatch(setGlobalCtxBackState(null))
    }
  }, [])

  useEffect(() => {
    if (!globalState.token.isLogin) history.push('/login?redirect=/event/thanksgiving')
  }, [globalState.token.isLogin])

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
