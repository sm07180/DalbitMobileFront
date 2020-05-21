import React, {useState, useEffect, useRef, useContext} from 'react'
import styled from 'styled-components'
import {BotButton} from 'pages/common/popup/tab/bot-button'
import {Scrollbars} from 'react-custom-scrollbars'
import SuccessPopup from 'pages/common/popup/tab/charge-success-popup'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import {Context} from 'context'
import _ from 'lodash'
import Api from 'context/api'
import Utility from 'components/lib/utility'
import qs from 'query-string'
// static
import closeBtn from 'components/ui/ic_back.svg'
import {Hybrid} from 'context/hybrid'

const chargeData = [
  {
    id: 0,
    type: '신용카드 결제',
    fetch: 'pay_card'
  },
  {
    id: 1,
    type: '휴대폰 결제',
    fetch: 'pay_phone'
  },
  {
    id: 2,
    type: '무통장 입금(계좌이체)',
    fetch: 'pay_virtual'
  }
  // {
  //   id: 3,
  //   type: '실시간 계좌이체',
  //   fetch: 'pay_bank'
  // }
]

let payType = ''
export default props => {
  const context = useContext(Context)
  //-------------------------------------------------------- declare start
  const [charge, setCharge] = useState(-1)
  const formTag = useRef()
  const area = useRef()

  const [itemInfo, setItemInfo] = useState(qs.parse(location.search))

  //-------------------------------------------------------- func start

  const doCharge = () => {
    payFetch()
  }

  //--------------------------------------------------------
  //fetch

  async function payFetch() {
    payType = chargeData[charge].fetch
    const obj = {
      data: {
        Prdtnm: itemInfo.name,
        Prdtprice: itemInfo.price,
        itemNo: itemInfo.itemNo
      }
    }
    const res = await Api[payType]({...obj})

    if (res.result == 'success' && _.hasIn(res, 'data')) {
      const {current} = formTag
      let ft = current

      const makeHiddenInput = (key, value) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'hidden')
        input.setAttribute('name', key)
        input.setAttribute('id', key)
        input.setAttribute('value', value)
        return input
      }

      Object.keys(res.data).forEach(key => {
        ft.append(makeHiddenInput(key, res.data[key]))
      })

      MCASH_PAYMENT(ft)
      ft.innerHTML = ''
    } else {
      context.action.alert({
        msg: res.message
      })
    }
  }

  const chargeClose = () => {
    //상단 백버튼, 취소하기 버튼
    Hybrid('ClosePayPopup')
  }
  //--------------------------------------------------------
  //useEffect
  useEffect(() => {
    console.log(itemInfo)
  }, [itemInfo])
  //-------------------------------------------------------- components start
  return (
    <Container ref={area}>
      <button className="close-btn" onClick={chargeClose}>
        뒤로가기
      </button>
      <form ref={formTag} name="payForm" acceptCharset="euc-kr" id="payForm"></form>
      <div className="title">달 충전하기</div>
      <InnerWrap>
        <InfoWrap>
          <Info>
            <div className="subTitle">구매 내역</div>
            <div>
              <div>결제상품</div>
              <div className="goods">{itemInfo.name}</div>
            </div>
            <div>
              <div>결제금액</div>
              <div className="price">
                {Utility.addComma(itemInfo.price)}
                <span>원</span>
              </div>
            </div>
          </Info>
        </InfoWrap>
        <PaymentWrap>
          <Payment>
            <div className="subTitle two">결제수단</div>
            <ItemArea>
              {chargeData.map((data, idx) => {
                return (
                  <ItemBox key={idx} onClick={() => setCharge(data.id)} active={idx === charge ? 'active' : ''}>
                    {data.type}
                  </ItemBox>
                )
              })}
            </ItemArea>
          </Payment>
        </PaymentWrap>

        <FixedWrap>
          <NoticeArea>
            <div className="noticeTitle">
              <div className="circle">!</div>
              <div>달 충전 안내</div>
            </div>
            <div className="notice">
              <p>충전한 달의 유효기간은 구매일로부터 5년입니다.</p>
              <p>달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</p>
              <p>미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 또는 법정대리인은 계약을 취소할 수 있습니다.</p>
              <p>사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 있습니다.</p>
            </div>
          </NoticeArea>
          <ButtonArea>
            <div>
              <BotButton
                width={150}
                height={48}
                background={'#fff'}
                color={'#632beb'}
                borderColor={'#632beb'}
                title={'취소하기'}
                clickEvent={() => {
                  chargeClose()
                }}
              />
              <BotButton
                width={150}
                height={48}
                background={charge != -1 ? '#632beb' : '#bdbdbd'}
                disabled={charge != -1 ? false : true}
                color={'#fff'}
                title={'충전하기'}
                clickEvent={doCharge}
              />
            </div>
          </ButtonArea>
        </FixedWrap>
      </InnerWrap>
    </Container>
  )
}
//-------------------------------------------------------- styled start
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 629px; */
  height: 100%;
  background-color: #fff;
  border-radius: 10px;

  .title {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 33px;
    font-size: 20px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.5px;
    text-align: center;
    color: #000;
    transform: skew(-0.03deg);
  }

  .subTitle {
    display: flex;
    width: 100%;
    border-bottom: 1px solid ${COLOR_MAIN};
    color: #632beb;
    font-size: 16px;
    font-weight: 600;
    line-height: 44px;
    letter-spacing: -0.4px;
    text-align: center;
    align-items: center;
    justify-content: space-between;
    transform: skew(-0.03deg);

    &.two {
      line-height: 44px;
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    .title {
      position: fixed;
      margin-top: 0;
      border-bottom: 1px solid #eeeeee;
      background: #fff;
      font-size: 18px;
      line-height: 49px;
      z-index: 1;
    }
  }

  .close-btn {
    display: inline-block;
    top: 12px;
    left: 4%;
    width: 30px;
    height: 30px;
    z-index: 10;
    position: absolute;
    text-indent: -9999px;
    cursor: pointer;
    :before {
      position: absolute;
      left: 11px;
      top: 8px;
      width: 10px;
      height: 10px;
      border-left: 2px solid #757575;
      border-top: 2px solid #757575;
      -webkit-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      transform: rotate(-45deg);
      content: '';
    }
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 100%;
  /* background-color: red; */

  & > div {
    display: flex;
    width: 100%;
    border-bottom: 1px solid #e0e0e0;
    color: #632beb;
    line-height: 44px;
    align-items: center;
    text-align: justify;
    color: #616161;
    font-size: 14px;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    justify-content: space-between;
  }

  .goods {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.43;
    letter-spacing: -0.35px;
    text-align: center;
    color: #424242;
    transform: skew(-0.03deg);
  }

  .price {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.11;
    letter-spacing: -0.45px;
    text-align: center;
    color: #ec455f;
    transform: skew(-0.03deg);
  }
  .price > span {
    font-size: 14px;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
  }
`
const InfoWrap = styled.div`
  display: flex;
  margin: 33px 0;
  width: 100%;
  justify-content: center;
  @media (max-width: ${WIDTH_MOBILE}) {
    margin-top: 64px;
  }
`
const PaymentWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`
const Payment = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 100%;

  & > div {
    display: flex;
  }

  .subTitle {
    line-height: 22px;
  }
`
const ItemBox = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 149px;
  height: 45px;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
  border-color: #e0e0e0;
  border-color: ${props => (props.active ? '#632beb' : '#e0e0e0')};

  font-size: 14px;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: -0.35px;
  color: ${props => (props.active ? '#632beb' : '#616161')};
  margin-bottom: 8px;
  transform: skew(-0.03deg);

  @media (max-width: ${WIDTH_MOBILE}) {
    width: 49%;
  }
  & + & + & {
    width: 100%;
  }
`
const ItemArea = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  width: 100%;
  margin-top: 14px;
`
const NoticeArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 23px;
  align-items: center;

  font-size: 12px;
  font-weight: 400;
  line-height: 1.67;
  letter-spacing: -0.3px;
  text-align: left;
  color: #9e9e9e;
  transform: skew(-0.03deg);

  .circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12px;
    border-radius: 30px;
    background-color: #bdbdbd;

    font-size: 7px;
    font-weight: 800;
    line-height: 1.14;
    letter-spacing: -0.18px;
    color: #fff;
    margin-right: 4px;
    margin-bottom: 1px;
    transform: skew(-0.03deg);
  }

  .notice {
    display: flex;
    flex-direction: column;
    width: 90%;
    p {
      position: relative;
      padding-left: 6px;
      &::before {
        display: inline-block;
        width: 2px;
        height: 2px;
        position: absolute;
        left: 0;
        top: 7px;
        background: #9e9e9e;
        content: '';
      }
    }
  }

  .noticeTitle {
    display: flex;
    width: 90%;
    margin-bottom: 7px;
    align-items: center;
  }
`
const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 13px;

  & > div {
    display: flex;
    width: 93%;
    height: 100%;
    align-items: center;
    justify-content: space-between;
  }
  button {
    width: 49% !important;
  }
`
const DepositInfo = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;

  .depositTitle {
    display: flex;
    flex-direction: column;
    width: 90%;
    height: 100%;

    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border-bottom-color: #e0e0e0;
      border-bottom-width: 1px;
      border-bottom-style: solid;

      font-size: 14px;
      font-weight: 400;
      line-height: 1.43;
      letter-spacing: -0.35px;
      color: #616161;
      transform: skew(-0.03deg);
      & > input {
        width: 232px;
        height: 40px;
        border-radius: 10px;
        border-style: solid;
        border-color: #e0e0e0;
        border-width: 1px;
        padding: 12px 10px 12px 10px;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.43;
        letter-spacing: -0.35px;
        transform: skew(-0.03deg);
      }
    }
  }

  .receipt {
    display: flex;
    flex-direction: column;
    width: 90%;
    /* height: 72px; */
    font-size: 14px;
    font-weight: 400;
    line-height: 1.43;
    letter-spacing: -0.35px;
    color: #616161;
    transform: skew(-0.03deg);

    & > span {
      display: flex;
      width: 100%;
      height: 36px;
      align-items: center;
    }

    .useage {
      display: flex;
      width: 100%;
      justify-content: space-between;
    }

    .receiptInfo {
      display: flex;
      width: 100%;
      height: 70px;
      /* background-color: yellow; */
      .select {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: space-between;

        & > input {
          display: flex;
          width: 66%;
          height: 40px;
          border-radius: 10px;
          border-style: solid;
          border-color: #e0e0e0;
          border-width: 1px;
          padding: 12px 10px 12px 10px;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.43;
          letter-spacing: -0.35px;
          transform: skew(-0.03deg);
        }
      }
    }
  }
`
const Useage = styled.button`
  width: 31%;
  height: 5vh;
  border-radius: 10px;
  border-color: ${props => (props.active ? '#632beb' : '#e0e0e0')};
  border-width: 1px;
  border-style: solid;
  color: ${props => (props.active ? '#632beb' : '#616161')};
`

const Event = styled.div`
  position: absolute;
  /* right: 23px; */
  /* top: 40px; */
  margin-top: 50px;
  width: 31%;
  padding: 13px 0;
  background-color: #fff;
  z-index: 3;
  border: 1px solid #e0e0e0;
  /* .scrollbar > div:nth-last-child(3) & {
    bottom: 0;
  } */
  & ul {
    & button {
      display: block;
      width: 100%;
      padding: 7px 0;
      box-sizing: border-box;
      color: #757575;
      font-size: 14px;
      text-align: center;
      letter-spacing: -0.35px;
      transform: skew(-0.03deg);
      &:hover {
        background-color: #f8f8f8;
      }
    }
  }
  &.on {
    display: none;
  }
`
const Select = styled.button`
  display: flex;
  width: 31%;
  height: 40px;
  border-radius: 10px;
  border-color: #e0e0e0;
  border-width: 1px;
  border-style: solid;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.67;
  letter-spacing: -0.3px;
  text-align: center;
  color: #616161;
  align-items: center;
  justify-content: space-between;
  justify-content: ${props => (props.active ? 'space-between' : 'center')};
  padding: 0px 3px 0px 3px;
  transform: skew(-0.03deg);
  & > div {
    display: flex;
    background: url(${IMG_SERVER}/images/api/ico_selectdown_g_s.png);
    width: 22px;
    height: 22px;
  }
`

const FixedWrap = styled.div`
  padding-bottom: 20px;
`
const InnerWrap = styled.div`
  @media (max-width: ${WIDTH_MOBILE}) {
    /* padding-bottom: 300px; */
  }
`
