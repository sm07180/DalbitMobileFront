import React from 'react'
import styled from 'styled-components'

// static

export default props => {
  return <Wrap></Wrap>
}
const Wrap = styled.div`
  width: 100%;
  background-color: red;
`
const CoinChargeBtn = styled.button`
  background-color: #632beb;
`

const CoinCurrentStatus = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`

const CoinCountingView = styled.div`
  border: 3px solid #632beb;
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
    color: #632beb;
    border-color: #632beb;
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
    color: #632beb;
  }
`
