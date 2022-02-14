import React, {useEffect, useContext} from 'react'
import {useLocation} from 'react-router-dom'
import qs from 'query-string'
import Api from 'context/api'

//context
import {Context} from 'context'
import {Hybrid} from 'context/hybrid'
import Utility from 'components/lib/utility'

export default () => {
  const location = useLocation()
  const {webview, canceltype} = qs.parse(location.search)

  const context = useContext(Context)
  if (location.state === undefined) {
    location.state = {
      result: 'fail',
      returntype: 'none'
    }
  }

  const {
    result,
    message,
    state,
    returntype,
    prdtPrice,
    prdtNm,
    phoneNo,
    orderId,
    cardName,
    cardNum,
    apprno,
    pgcode,
    giftType,
    itemCnt
  } = location.state

  let payType = ''

  const makePayType = () => {
    if (!phoneNo && cardNum) {
      payType = '카드 결제'
    } else if (!cardNum && phoneNo) {
      payType = '휴대폰 결제'
    } else if (giftType !== undefined) {
      switch (giftType) {
        case 'GM':
          payType = '문화상품권'
          break
        case 'GG':
          payType = '스마트문상(게임문화상품권)'
          break
        case 'GC':
          payType = '도서문화상품권'
          break
        case 'HM':
          payType = '해피머니상품권'
          break
        default:
          payType = '상품권'
          break
      }
    } else {
      switch (pgcode) {
        case 'tmoney':
          payType = '티머니'
          break
        case 'cashbee':
          payType = '캐시비'
          break
        case 'kakaopay':
          payType = '카카오페이(카드)'
          break
        case 'payco':
          payType = '페이코'
          break
        case 'toss':
          payType = '토스'
          break
        case 'kakaoMoney':
          payType = '카카오페이(머니)'
          break
        case 'simple':
          payType = '계좌 간편결제'
          break
        default:
          payType = 'PayLetter'
          break
      }
    }
  }

  useEffect(() => {
    // alert(JSON.stringify(location.search, null, 1))
    // alert(JSON.stringify(location.state, null, 1))

    if (canceltype !== undefined) {
      if (canceltype === 'room') {
        return Hybrid('ClosePayPopup')
      } else {
        return (window.location.href = '/')
      }
    }

    if (result === 'success') {
      if (returntype === 'room') {
        //Facebook,Firebase 이벤트 호출
        try {
          fbq('track', 'Purchase')
          firebase.analytics().logEvent('Purchase')
          kakaoPixel('114527450721661229').purchase()
        } catch (e) {}

        context.action.alert({
          msg: `결제가 완료되었습니다. \n 충전 내역은 '마이페이지 >\n 내 지갑'에서 확인해주세요.`,
          callback: () => {
              Hybrid('CloseLayerPopup')
              Hybrid('ClosePayPopup')
          }
        })
      } else {
        //Facebook,Firebase 이벤트 호출
        try {
          fbq('track', 'Purchase', {price: prdtPrice})
          firebase.analytics().logEvent('Purchase', {price: prdtPrice})
          kakaoPixel('114527450721661229').purchase({total_price: prdtPrice, currency: 'KRW'})
        } catch (e) {}
        makePayType()
        const payInfo = {
          prdtPrice: prdtPrice,
          prdtNm: prdtNm,
          payType: payType,
          phoneNo: phoneNo,
          orderId: orderId,
          cardName: cardName,
          cardNum: cardNum,
          apprno: apprno,
          itemCnt: itemCnt
        }
        sessionStorage.setItem('pay_info', JSON.stringify(payInfo))
        if (returntype === 'store') {
          window.location.href = '/'
        } else if (returntype === 'chooseok') {
          window.location.href = '/event/purchase'
        }
      }
    } else {
      if (returntype === 'room') {
        context.action.alert({
          msg: message,
          callback: () => {
            Hybrid('ClosePayPopup')
          }
        })
      } else if (returntype === 'store') {
        context.action.alert({
          msg: message,
          callback: () => {
            window.location.href = '/'
          }
        })
      } else {
        Hybrid('ClosePayPopup')
        window.location.href = '/'
      }
    }
  }, [])

  return <></>
}
