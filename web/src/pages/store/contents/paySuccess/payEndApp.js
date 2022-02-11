import qs from "query-string";
import React, {useContext, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {Context} from "context";
import {Hybrid} from "context/hybrid";

export default function PayEndApp() {
  const location = useLocation()
  const history = useHistory();
  const { cancelType } = qs.parse(location.search)

  const context = useContext(Context)
  if (location.state === undefined) {
    location.state = {
      result: 'fail',
      returnType: 'none'
    }
  }

  const {result, message, state, returnType, prdtPrice, prdtNm, phoneNo, orderId, cardName, cardNum, apprno, pgcode, giftType, itemCnt} = location.state

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

    if (cancelType !== undefined) {
      if (cancelType === 'room') {
        return Hybrid('ClosePayPopup')
      } else {
        history.push({pathname:"/store"})
      }
    }

    if (result === 'success') {
      if (returnType === 'room') {
        try {
          fbq('track', 'Purchase')
          firebase.analytics().logEvent('Purchase')
          kakaoPixel('114527450721661229').purchase()
        } catch (e) {
        }
        context.action.alert({
          msg: `결제가 완료되었습니다. \n 충전 내역은 '마이페이지 >\n 내 지갑'에서 확인해주세요.`,
          callback: () => {
            Hybrid('CloseLayerPopup')
            Hybrid('ClosePayPopup')
          }
        })
      } else {
        try {
          fbq('track', 'Purchase', {price: prdtPrice})
          firebase.analytics().logEvent('Purchase', {price: prdtPrice})
          kakaoPixel('114527450721661229').purchase({total_price: prdtPrice, currency: 'KRW'})
        } catch (e) {
        }
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
        if (returnType === 'store') {
          window.location.href = '/'
        }
      }
    } else {
      if (returnType === 'room') {
        context.action.alert({
          msg: message,
          callback: () => {
            Hybrid('ClosePayPopup')
          }
        })
      } else if (returnType === 'store') {
        context.action.alert({
          msg: message,
          callback: () => {
            history.push({pathname:"/store"})
          }
        })
      } else {
        Hybrid('ClosePayPopup')
        history.push({pathname:"/store"})
      }
    }
  }, [])

  return <></>
}
