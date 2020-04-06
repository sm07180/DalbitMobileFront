import React, {useContext} from 'react'
import styled from 'styled-components'
import {LButton} from './bot-button'
import {Context} from 'context'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

// props 로 가져온 데이터들 바인딩 필요함
export default props => {
  //---------------------------------------------------------------- declare start
  const context = useContext(Context)
  const {type, itemName, price, date, cardName, cardNum, phone} = props.detail
  //---------------------------------------------------------------- func start
  //---------------------------------------------------------------- components start
  return (
    <Container>
      <div>
        <div className="title">결제완료</div>

        <Wrap>
          <div className="subTitle">결제내역</div>
          {props.detail && (
            <ChargeHistory>
              <div className="subTitle">
                <span>가맹점</span>
                <div>달빛라이브</div>
              </div>
              <div className="subTitle">
                <span>상품명</span>
                <div>{itemName}</div>
              </div>
              <div className="subTitle">
                <span>결제 금액</span>
                <div>{price}</div>
              </div>
              <div className="subTitle">
                <span>결제 일시</span>
                <div>{date}</div>
              </div>
              {type == 'pay_card' && (
                <>
                  <div className="subTitle">
                    <span>카드명</span>
                    <div>{cardName}</div>
                  </div>
                  <div className="subTitle">
                    <span>카드번호</span>
                    <div>{cardNum}</div>
                  </div>
                </>
              )}
              {type == 'pay_phone' && (
                <>
                  <div className="subTitle">
                    <span>주문자 휴대번호</span>
                    <div>{phone}</div>
                  </div>
                </>
              )}
            </ChargeHistory>
          )}
        </Wrap>
      </div>
      <ButtonArea>
        <LButton background={'#8556f6'} title={'완료'} clickEvent={() => context.action.updatePopupVisible(false)} />
      </ButtonArea>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;

  & > div {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  min-height: 486px;
  margin: 0 auto;
  margin-top: 33px;

  @media (max-width: ${WIDTH_MOBILE}) {
    margin-top: 76px;
  }
`

const ChargeHistory = styled.div`
  .subTitle {
    border-bottom-color: #e0e0e0 !important;

    & > span {
      color: #616161;
      font-size: 14px;
      font-weight: 400;
      letter-spacing: -0.35px;
    }

    & > div {
      color: #424242;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: -0.35px;
    }
  }
`
const ButtonArea = styled.div`
  display: flex;

  align-items: flex-end;
  width: 90% !important;
  height: 48px;
  margin-bottom: 12px;
  margin-top: 20px;

  @media (max-width: ${WIDTH_MOBILE}) {
    position: fixed;
    bottom: 0;
  }
`
