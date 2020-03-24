import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'

// context
import {Context} from 'context'

// component
import Paging from 'components/ui/paging.js'

// static
import coinIcon from 'images/ic_moon_l@2x.png'

export default props => {
  const ctx = useContext(Context)
  return (
    <div>
      <TitleWrap>
        <span className="text">내 지갑</span>
        <div>
          <CoinTypeBtn style={{marginRight: '5px'}}>달</CoinTypeBtn>
          <CoinTypeBtn style={{marginLeft: '5px'}}>별</CoinTypeBtn>
        </div>
      </TitleWrap>

      <CoinCountingView>
        <CoinCurrentStatus>
          <span className="text">현재 보유 달:</span>
          <img className="coin-img" src={coinIcon} style={{width: '44px'}} />
          <span className="current-value">20,520</span>
        </CoinCurrentStatus>
        <CoinChargeBtn>충전하기</CoinChargeBtn>
      </CoinCountingView>

      <Paging prevClickEvent={() => {}} nextClickEvent={() => {}} btnClickEvent={() => {}} totalPage={3} currentPage={1} currentIdx={1} />
    </div>
  )
}

const CoinChargeBtn = styled.button`
  padding: 16px 44px;
  color: #fff;
  background-color: #8556f6;
  border-radius: 10px;
`

const CoinCurrentStatus = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  user-select: none;

  .text {
    color: #9e9e9e;
    font-size: 16px;
    letter-spacing: -0.4px;
  }
  .coin-img {
    margin-left: 20px;
  }
  .current-value {
    color: #8556f6;
    font-size: 28px;
    letter-spacing: -0.7px;
  }
`

const CoinCountingView = styled.div`
  border: 3px solid #8556f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  box-sizing: border-box;
`

const CoinTypeBtn = styled.button`
  color: #757575;
  width: 86px;
  padding: 15px 0;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  border-radius: 24px;

  &.active {
    color: #8556f6;
    border-color: #8556f6;
  }
`

const TitleWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 36px;
  margin-bottom: 16px;

  .text {
    font-size: 20px;
    letter-spacing: -0.5px;
    color: #8556f6;
  }
`
