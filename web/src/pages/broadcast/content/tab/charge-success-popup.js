import React, {useContext} from 'react'
import styled from 'styled-components'
import {LButton} from './bot-button'
import {BroadCastStore} from '../../store'
import {Context} from 'context'

// props 로 가져온 데이터들 바인딩 필요함
export default props => {
  //---------------------------------------------------------------- declare start
  const context = useContext(Context)
  //---------------------------------------------------------------- func start
  //---------------------------------------------------------------- components start
  return (
    <Container>
      <div>
        <div className="title">달 충전 결제 대기중</div>
        <Wrap>
          <div className="subTitle">결제대기중</div>
          <ChargeHistory>
            <div className="subTitle">
              <span>입금하실 금액</span>
              <div>11,000(부가세 포함)</div>
            </div>
            <div className="subTitle">
              <span>예금주</span>
              <div>(주)인포렉스</div>
            </div>
            <div className="subTitle">
              <span>입금은행</span>
              <div>KB 국민은행</div>
            </div>
            <div className="subTitle">
              <span>입금계좌</span>
              <div>197790-71-606640</div>
            </div>
            <div className="subTitle">
              <span>입금자</span>
              <div>손흥민</div>
            </div>
          </ChargeHistory>
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
    width: 90%;
  }
`
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 33px;
`

const ChargeHistory = styled.div`
  .subTitle {
    border-bottom-color: #e0e0e0;

    & > span {
      color: #616161;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.43;
      letter-spacing: -0.35px;
    }

    & > div {
      color: #424242;
      font-size: 14px;
      font-weight: 600;
      line-height: 1.43;
      letter-spacing: -0.35px;
    }
  }
`
const ButtonArea = styled.div`
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 48px;
  margin-bottom: 12px;
`
