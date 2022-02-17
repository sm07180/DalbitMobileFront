import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'
import styled from 'styled-components'

import LayerPopupPay from './layer_popup_pay'
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
      if (myDal >= 5000) {
        return dispatch(setGlobalCtxMessage({type: "alert", msg: '추가 보너스 250달과 룰렛이용권 35개가 지급되었습니다'}))
      } else if (myDal >= 3000 && myDal < 5000) {
        return dispatch(setGlobalCtxMessage({type: "alert", msg: '추가 보너스 120달과 룰렛이용권 17개가 지급되었습니다'}))
      } else if (myDal >= 1000 && myDal < 3000) {
        return dispatch(setGlobalCtxMessage({type: "alert", msg: '추가 보너스 30달과 룰렛이용권 5개가 지급되었습니다'}))
      } else if (myDal < 1000) {
        return dispatch(setGlobalCtxMessage({type: "alert", msg: '조건 미달로 보너스를 받을 수 없습니다'}))
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
    if (!globalState.token.isLogin) history.push('/login?redirect=/event/purchase')
  }, [globalState.token.isLogin])

  return (
    <Content>
      <div id="purchase">
        <div className="content">
          <button className="btnBack" onClick={() => history.goBack()}>
            <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
          </button>
          <img src={`${IMG_SERVER}/event/purchase/202012/visual.png`} alt="행복하고 따뜻한 연말 보내세요" />
          <div className="middleWrap">
            <div className="inner">
              <span className="text">
                내가 구매한 달 :
                <span>
                  {myDal}
                  <em>달</em>
                </span>
              </span>
              <button className="btn_purchase" onClick={HandleStore}>
                <img src={`${IMG_SERVER}/event/purchase/202012/btn_buy.png`} alt="구매하기" />
              </button>
            </div>
          </div>
          <img src={`${IMG_SERVER}/event/purchase/202012/content1.png`} alt="일정기준 이상 달 구매시 보너스 지급" />
          <div className="bottomWrap">
            <button onClick={fetchGetBonus}>
              <img src={`${IMG_SERVER}/event/purchase/202012/btn_bonus.png`} alt="추가보너스 달 받기" />
            </button>
          </div>
          <div className="notice">
            <img src="https://image.dalbitlive.com/event/purchase/202012/notice_text.png" alt="유의사항" />
            <ul className="text">
              <li>보너스 달과 룰렛이용권은 이벤트 종료후 12월 30일~ 31일 기간동안 받을 수 있습니다.</li>
              <li>이벤트 기간중 5000달 이상 구매한 경우 즉시 보너스 달을 받을 수 있습니다.</li>
              <li>해당 이벤트는 한 계정 당 1회 보너스를 지급받을 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
      {payState && <LayerPopupPay info={payState} setPopup={setPayPopup} />}
    </Content>
  )
}
const Content = styled.div`
  max-width: 460px;
  margin: auto;
  background: #1a2940;
  #purchase {
    position: relative;
    min-height: calc(100vh - 50px);
    .content {
      position: relative;
      img {
        width: 100%;
      }
      .middleWrap {
        display: flex;
        align-items: center;
        height: 52px;
        margin: 0 4%;
        background: url('https://image.dalbitlive.com/event/purchase/202012/bg_event.png') no-repeat 0 0;

        .inner {
          position: relative;
          width: 100%;
          height: 44px;
          padding: 4px 4px 4px 12px;
          border-radius: 6px;
          border: 2px solid #5c73a4;
          box-sizing: border-box;
        }

        .text {
          display: inline-block;
          width: calc(100% - 35%);
          height: 32px;
          padding-left: 25px;
          background: url('https://image.dalbitlive.com/event/thxgiving/ic_moon.png') no-repeat left center;
          background-size: 20px;
          font-size: 14px;
          line-height: 32px;
          letter-spacing: -1px;
          color: #fff;
          span {
            display: block;
            float: right;
            font-size: 19px;
            line-height: 32px;
            color: #ffe83e;
            em {
              padding-left: 5px;
              vertical-align: top;
              font-style: normal;
              font-size: 14px;
              color: #ffe83e;
            }
          }
        }
        .btn_purchase {
          display: inline-block;
          position: absolute;
          right: 4px;
          top: 4px;
          width: 80px;
          height: 32px;
          > img {
            width: 100%;
          }
        }
      }

      .bottomWrap {
        width: 100%;
        height: auto;
        text-align: center;
        button {
          max-width: 531px;
          width: 75%;
        }
      }
    }
    .notice {
      .text {
        display: none;
      }
    }

    .player_show {
      #purchase {
        .bottomWrap {
          bottom: 20%;
        }
      }
    }
  }
  .btnBack {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 40px;
    height: 40px;
  }
`
