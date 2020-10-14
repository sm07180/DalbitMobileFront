/**
 * @route /pay/charge
 * @file /pay/content/charge/index
 * @brief 달 충전 페이지에서 충전 아이템 클릭 후 결제하기로 넘어갔을때 나오는 결제 페이지
 *        무통장 입금 - coocoon (로컬에서 테스트 가능)
 *        모빌리언스 - 카드, 휴대폰, 문화상품권, 해피머니 (dev2에서 테스트 가능)
 *        페이레터 - 카카오페이, 페이코, 티머니, 캐시비  (dev-스테이지서버 에서만 테스트 가능)
 * @date_20200728 스마트문상, 도서문화상품권 숨김처리
 */

import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'
import styled from 'styled-components'

//context
import {Context} from 'context'
import {OS_TYPE} from 'context/config.js'
import {COLOR_MAIN} from 'context/color'
import Api from 'context/api'
import qs from 'query-string'

//layout
import Header from 'components/ui/new_header'

//static
import icoNotice from '../../static/ic_notice.svg'
import icoMore from '../../static/icn_more_xs_gr.svg'

//방송방 내 결제에서는 헤더 보이지 않기, 취소 처리 등 다름

export default (props) => {
  const history = useHistory()

  //context
  const context = useContext(Context)
  const customHeader = JSON.parse(Api.customHeader)

  //state
  const [selectedPay, setSelectedPay] = useState({type: '', fetch: ''})
  const [moreState, setMoreState] = useState(false)

  //ref
  const formTag = useRef(null)
  const {selected} = props
  //결제 data 셋팅
  const {name, price, itemNo, webview, event} = selected
  let pageCode = webview === 'new' ? '2' : '1'
  if (event === '3') pageCode = '3'

  let payMethod = [
    {type: '무통장 입금(계좌이체)', code: 'coocon'},
    {type: '카드 결제', fetch: 'pay_card'},
    {type: '휴대폰 결제', fetch: 'pay_phone'},
    {type: '카카오페이', fetch: 'pay_letter', code: 'kakaopay'},
    {type: '페이코', fetch: 'pay_letter', code: 'payco'},
    {type: '티머니', fetch: 'pay_letter', code: 'tmoney'},
    {type: '문화상품권', fetch: 'pay_gm'},
    {type: '캐시비', fetch: 'pay_letter', code: 'cashbee'},
    {type: '해피머니상품권', fetch: 'pay_hm'}
    // { type: "스마트문상(게임문화상품권)", fetch: 'pay_gg' },
    // { type: "도서문화상품권", fetch: 'pay_gc' },
  ]

  async function payFetch() {
    const {type, fetch, code} = selectedPay

    if (customHeader['os'] === OS_TYPE['Android'] && customHeader['appBuild'] < 20 && fetch === 'pay_letter') {
      return context.action.confirm({
        msg: `해당 결제수단은 앱 업데이트 후 이용 가능합니다. 업데이트 받으시겠습니까?`,
        callback: () => {
          window.location.href = 'market://details?id=kr.co.inforexseoul.radioproject'
        }
      })
    }

    if (code === 'coocon') {
      return history.push({
        pathname: '/pay/bank',
        state: {
          prdtNm: name,
          prdtPrice: price,
          itemNo: itemNo,
          webview: webview,
          event: event
        }
      })
    }

    const {result, data, message} = await Api[fetch]({
      data: {
        Prdtnm: name,
        Prdtprice: price,
        itemNo: itemNo,
        pageCode: pageCode,
        pgCode: code
      }
    })

    if (result === 'success') {
      if (data.hasOwnProperty('mobileUrl')) return (window.location.href = data.mobileUrl)

      let payForm = formTag.current
      const makeHiddenInput = (key, value) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', key)
        input.setAttribute('id', key)
        input.setAttribute('value', value)
        return input
      }
      Object.keys(data).forEach((key) => {
        payForm.append(makeHiddenInput(key, data[key]))
      })
      MCASH_PAYMENT(payForm)
      payForm.innerHTML = ''
    } else {
      context.action.alert({
        msg: message
      })
    }
  }

  useEffect(() => {
    if (selectedPay.type) payFetch()
  }, [selectedPay])

  const createMethodBtn = (type) => {
    let currentPayMethod = []
    if (type === 'more') {
      currentPayMethod = payMethod.slice(3)
    } else {
      currentPayMethod = payMethod.slice(0, 3)
    }
    return currentPayMethod.map((item, idx) => {
      const {type} = item
      return (
        <button key={idx} className={type === selectedPay.type ? 'on' : ''} onClick={() => setSelectedPay(item)}>
          {type}
        </button>
      )
    })
  }

  return (
    <>
      {webview !== 'new' && <Header title="달 충전" />}
      <Content className={webview}>
        <h2>구매 내역</h2>
        <div className="field">
          <label>결제상품</label>
          <p>{name}</p>
        </div>
        <div className="field">
          <label>결제금액</label>
          <p>
            <strong>{Number(price).toLocaleString()} 원</strong>
          </p>
        </div>

        <h2 className="more-tab">
          결제 수단
          {/* <button
            onClick={() => {
              setMoreState(!moreState)
            }}>
            {moreState ? '결제수단 간략 보기' : '결제수단 전체 보기'}
          </button> */}
        </h2>
        <div className="select-item">{createMethodBtn('top')}</div>
        <div className="more-wrap">
          {/* <div className={`select-item more ${moreState}`}>{createMethodBtn('more')}</div> */}
          <div className={`select-item more true`}>{createMethodBtn('more')}</div>
        </div>

        <div className="info-wrap">
          <h5>
            달 충전 안내
            <span>
              <strong>결제 문의</strong>1522-0251
            </span>
          </h5>
          <p>충전한 달의 유효기간은 구매일로부터 5년입니다.</p>
          <p>달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</p>
          <p>미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 또는 법정대리인은 계약을 취소할 수 있습니다.</p>
          <p>사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 있습니다.</p>
        </div>

        <form ref={formTag} name="payForm" acceptCharset="euc-kr" id="payForm"></form>
      </Content>
    </>
  )
}

const Content = styled.div`
  min-height: calc(100vh - 40px);
  padding: 0 16px;
  background: #eeeeee;
  padding-bottom: 30px;
  &.new {
    min-height: 100%;
  }

  h2 {
    padding: 15px 0 4px 0;
    font-size: 16px;
    font-weight: 900;

    &.more-tab {
      display: flex;
      margin: 2px 0 4px 0;

      button {
        margin-left: auto;
        font-size: 12px;
        line-height: 20px;
        color: rgb(66, 66, 66);
        border-bottom: 1px solid rgb(66, 66, 66);
        &:after {
          display: inline-block;
          width: 6px;
          height: 16px;
          margin-top: 2px;
          margin-left: 3px;
          background: url(${icoMore}) no-repeat center;
          vertical-align: top;
          content: '';
        }
      }
    }
  }

  .field {
    display: flex;
    align-items: center;
    height: 44px;
    margin-top: 4px;
    padding: 0 16px;
    border-radius: 12px;
    border: solid 1px #e0e0e0;
    background-color: #ffffff;

    label {
      color: ${COLOR_MAIN};
      font-size: 14px;
      font-weight: bold;
    }
    p {
      margin-left: auto;
      font-size: 14px;
      font-weight: bold;
      strong {
        font-size: 18px;
      }
    }
  }

  .select-item {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    button {
      width: calc(50% - 2px);
      height: 44px;
      margin-bottom: 4px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e0e0e0;
      font-size: 14px;
      font-weight: bold;

      &.on {
        border-color: ${COLOR_MAIN};
        color: ${COLOR_MAIN};
      }
    }
    button:nth-child(1) {
      width: 100%;
    }
    &.more {
      overflow: hidden;
      height: 144px;
      transition: height 0.3s ease-in-out;
    }
    &.more button:nth-child(1) {
      width: calc(50% - 2px);
    }
    &.more.false {
      height: 0px;
    }
    &.more.true {
      height: 144px;
    }
  }

  .info-wrap {
    margin-top: 22px;
    h5 {
      display: flex;
      margin-bottom: 8px;
      padding-left: 16px;
      background: url(${icoNotice}) no-repeat left center;
      color: #424242;
      font-size: 12px;
      font-weight: bold;
      span {
        display: inline-block;

        margin-left: auto;
        color: ${COLOR_MAIN};
        font-weight: 800;
        strong {
          padding-right: 4px;
          color: #000;
        }
      }
    }
    p {
      position: relative;
      padding-left: 16px;
      color: #757575;
      font-size: 12px;
      line-height: 20px;
      &::before {
        position: absolute;
        left: 6px;
        top: 9px;
        width: 2px;
        height: 2px;
        background: #757575;
        content: '';
      }
    }
  }
`
