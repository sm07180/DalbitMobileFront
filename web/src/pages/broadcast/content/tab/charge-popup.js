import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {BotButton} from './bot-button'
import {Scrollbars} from 'react-custom-scrollbars'

const testData = [
  {
    id: 0,
    type: '신용카드 결제'
  },
  {
    id: 1,
    type: '휴대폰 결제'
  },
  {
    id: 2,
    type: '무통장 입금(계좌이체)'
  },
  {
    id: 3,
    type: '실시간 계좌이체'
  }
]
export default props => {
  //-------------------------------------------------------- declare start
  const [charge, setCharge] = useState(-1)
  const scrollbars = useRef(null)
  //-------------------------------------------------------- func start
  //-------------------------------------------------------- components start
  return (
    <Container>
      <Scrollbars ref={scrollbars} style={{height: '629px'}} autoHide>
        <div className="title">달 충전하기</div>
        <InfoWrap>
          <Info>
            <div className="subTitle">구매 내역</div>
            <div>
              <div>결제상품</div>
              <div className="goods">달&nbsp;100</div>
            </div>
            <div>
              <div>결제금액</div>
              <div className="price">
                10,000<span>원</span>
              </div>
            </div>
          </Info>
        </InfoWrap>
        <PaymentWrap>
          <Payment>
            <div className="subTitle">결제수단</div>
            <ItemArea>
              {testData.map((data, idx) => {
                return (
                  <ItemBox key={idx} onClick={() => setCharge(data.id)} active={idx === charge ? 'active' : ''}>
                    {data.type}
                  </ItemBox>
                )
              })}
            </ItemArea>
          </Payment>
        </PaymentWrap>
        {charge === 2 && (
          <DepositInfo>
            <div className="subTitle">무통장 입금</div>
          </DepositInfo>
        )}
        <NoticeArea>
          <div className="noticeTitle">
            <div className="circle">!</div>
            <div>달 충전 안내</div>
          </div>
          <div className="notice">
            <p>∙ 충전한 달의 유효기간은 구매일로부터 5년입니다.</p>
            <p>∙ 달 보유/구매/선물 내역은 내지갑에서 확인할 수 있습니다.</p>
            <p>∙ 미성년자가 결제할 경우 법정대리인이 동의하지 아니하면 본인 </p>
            <p>&nbsp;&nbsp;또는 법정대리인은 계약을 취소할 수 있습니다.</p>
            <p>∙ 사용하지 아니한 달은 7일 이내에 청약철회 등 환불을 할 수 </p>
            <p>&nbsp;&nbsp;있습니다.</p>
          </div>
        </NoticeArea>
        <ButtonArea>
          <div>
            <BotButton width={150} height={48} background={'#fff'} color={'#8556f6'} borderColor={'#8556f6'} title={'취소하기'} />
            <BotButton width={150} height={48} background={charge != -1 ? '#8556f6' : '#bdbdbd'} color={'#fff'} title={'충전하기'} />
          </div>
        </ButtonArea>
      </Scrollbars>
    </Container>
  )
}
//-------------------------------------------------------- styled start
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* height: 629px; */
  background-color: #fff;
  border-radius: 10px;

  .title {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 22px;
    margin-top: 33px;
    font-size: 20px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.5px;
    text-align: center;
    color: #424242;
  }

  .subTitle {
    display: flex;
    width: 100%;
    height: 48px;
    color: #8556f6;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.4px;
    text-align: center;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    align-items: center;
    justify-content: space-between;
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
    height: 48px;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    align-items: center;
    justify-content: space-between;

    color: #616161;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.43;
    letter-spacing: -0.35px;
  }

  .goods {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.43;
    letter-spacing: -0.35px;
    text-align: center;
    color: #424242;
  }

  .price {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.11;
    letter-spacing: -0.45px;
    text-align: center;
    color: #ec455f;
  }
  .price > span {
    font-size: 14px;
    letter-spacing: -0.35px;
  }
`
const InfoWrap = styled.div`
  display: flex;
  width: 100%;
  height: 144px;
  justify-content: center;
  margin-top: 33px;
  margin-bottom: 33px;
`
const PaymentWrap = styled.div`
  display: flex;
  width: 100%;
  height: 130px;
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
`
const ItemBox = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 146px;
  height: 45px;
  border-radius: 10px;
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
  border-color: #e0e0e0;
  border-color: ${props => (props.active ? '#8556f6' : '#e0e0e0')};

  font-size: 14px;
  font-weight: 400;
  line-height: 1.43;
  letter-spacing: -0.35px;
  color: ${props => (props.active ? '#8556f6' : '#616161')};
  margin-bottom: 8px;
`
const ItemArea = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  width: 100%;
  height: 110px;
  margin-top: 14px;
`
const NoticeArea = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 139px;
  margin-top: 23px;
  align-items: center;

  font-size: 12px;
  font-weight: 400;
  line-height: 1.67;
  letter-spacing: -0.3px;
  text-align: left;
  color: #9e9e9e;

  .circle {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12px;
    height: 12px;
    border-radius: 30px;
    background-color: #bdbdbd;

    font-size: 7px;
    font-weight: 800;
    line-height: 1.14;
    letter-spacing: -0.18px;
    color: #fff;
    margin-right: 4px;
  }

  .notice {
    display: flex;
    flex-direction: column;
    width: 90%;
  }

  .noticeTitle {
    display: flex;
    width: 90%;
    height: 12px;
    margin-bottom: 7px;
    align-items: center;
  }
`
const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  justify-content: center;
  margin-top: 15px;

  & > div {
    display: flex;
    width: 90%;
    height: 100%;
    align-items: center;
    justify-content: space-between;
  }
`
const DepositInfo = styled.div`
  display: flex;
  width: 90%;
  height: 250px;
  flex-direction: column;
  background: red;
  align-items: center;
`
