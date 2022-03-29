import React, {useState, useContext, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import {IMG_SERVER} from 'context/config'
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'
import Api from 'context/api'
import styled from 'styled-components'

import LayerPopupPay from './layer_popup_pay'

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
      if (myDal >= 20000) {
        return context.action.alert({
          msg: `추가 보너스 ${res.data.bonusDal.dal}달과 룰렛이용권 70개, 부스터 10개가 지급되었습니다`
        })
      } else if (myDal >= 10000 && myDal < 20000) {
        return context.action.alert({msg: `추가 보너스 ${res.data.bonusDal.dal}달과 룰렛이용권 70개가 지급되었습니다`})
      } else if (myDal >= 5000 && myDal < 10000) {
        return context.action.alert({msg: `추가 보너스 ${res.data.bonusDal.dal}달과 룰렛이용권 30개가 지급되었습니다`})
      } else if (myDal >= 1000 && myDal < 5000) {
        return context.action.alert({msg: `추가 보너스 ${res.data.bonusDal.dal}달과 룰렛이용권 5개가 지급되었습니다`})
      } else if (myDal < 1000) {
        return context.action.alert({msg: '조건 미달로 보너스를 받을 수 없습니다'})
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
      // return webkit.messageHandlers.openInApp.postMessage('')
      return history.push('/store')
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
    if (!context.token.isLogin) history.push('/login?redirect=/event/new_year')
  }, [context.token.isLogin])

  return (
    <Content>
      <div id="newYear">
        <div className="content">
          <button className="btnBack" onClick={() => history.goBack()}>
            <img src="https://image.dalbitlive.com/svg/close_w_l.svg" alt="close" />
          </button>
          <img
            src={`${IMG_SERVER}/event/new_year/210126/visual.png`}
            alt="2021년 첫 구매 이벤트 최대 5%의 보너스! 룰렛이용권, 부스터까지! 이벤트 기간동안 달을 구매하면
보너스 달과 룰렛이용권, 부스터를 드립니다."
          />
          <div className="middleWrap">
            <div className="inner">
              <span className="text">
                내가 구매한 달 :
                <span>
                  {myDal}
                  <em>달</em>
                </span>
              </span>
              <button className="btn_new_year" onClick={HandleStore}>
                <img src={`${IMG_SERVER}/event/new_year/210126/btn_buy.png`} alt="구매하기" />
              </button>
            </div>
          </div>
          <img src={`${IMG_SERVER}/event/new_year/210126/content1.png`} alt="일정기준 이상 달 구매시 보너스 지급" />
          <div className="bottomWrap">
            <button onClick={fetchGetBonus}>
              <img src={`${IMG_SERVER}/event/new_year/210126/btn_bonus.png`} alt="추가보너스 달 받기" />
            </button>
          </div>
          <div className="notice">
            <img src="https://image.dalbitlive.com/event/new_year/210126/notice_text.jpg" alt="유의사항" />
            <ul className="text">
              <li> · 보너스는 이벤트 종료 후 2월1일 받을 수 있습니다. </li>
              <li>
                · 보너스 지급시 소수점은 제외됩니다.
                <br />※ 예 : 1250개 구매시 3%인 37.5개 중 0.5개가 제외된 37개 지급
              </li>
              <li>
                · 부스터 아이템은 본인 방에서만 사용할 수 있습니다. 랭킹 또는 리포트, 마이페이지 상에 별과 좋아요로 집계되지
                않습니다. 
              </li>
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
  background: #312b6b;
  #newYear {
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

        .btn_new_year {
          display: block;
          img {
            width: 100%;
          }
        }
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
          width: calc(100% - 40%);
          height: 32px;
          padding-left: 30px;
          background: url('https://image.dalbitlive.com/event/thxgiving/ic_moon.png') no-repeat left center;
          background-size: 20px;
          font-size: 14px;
          line-height: 32px;
          color: #ffe45d;
          span {
            display: block;
            float: right;
            font-size: 19px;
            line-height: 32px;
            color: #fff;
            em {
              padding-left: 5px;
              vertical-align: top;
              font-style: normal;
              font-size: 14px;
              color: #ffe83e;
            }
          }
        }
        .btn_new_year {
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
        position: absolute;
        bottom: 18%;
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
      margin-top: 10%;
      .text {
        display: none;
      }
    }

    .player_show {
      #newYear {
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
