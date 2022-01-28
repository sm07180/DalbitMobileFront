import React, {useContext} from 'react'
import styled from 'styled-components'

import {WIDTH_MOBILE} from 'context/config'

import NoResult from 'components/ui/noResult'
// svg
// context
import {Context} from 'context'
import PurchaseIcon from '../../static/ic_purchase_yellow.svg'
import GiftPinkIcon from '../../static/ic_gift_pink.svg'
import ExchangeIcon from '../../static/ic_exchange_purple.svg'
import ArrowDownIcon from '../../static/ic_arrow_down_gray.svg'
import MoneyIcon from '../../static/money_blue.svg'

export default (props) => {
  const context = useContext(Context)
  const {formState, walletData, returnCoinText, totalCnt, isFiltering, setShowFilter, setCancelExchange} = props

  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(4, 6), date.slice(6)].join('.')
    return `${date}`
  }

  const exchangeCancel = (exchangeIdx) => {
    context.action.confirm({
      msg: '환전신청을 취소하시겠습니까?',
      callback: () => {
        setCancelExchange(exchangeIdx)
      }
    })
  }
  return (
    <ListContainer>
      <TopArea>
        <span className="title">
          <span className="main">{`${returnCoinText(formState.coinType)} 상세내역`}</span>
          <span className="sub">최근 6개월</span>
        </span>
      </TopArea>
      <SelectWrap
        onClick={() => {
          setShowFilter(true)
        }}>
        <button>
          <img src={ArrowDownIcon} />
          {isFiltering === false ? '전체 내역' : formState.coinType === 'byeol' ? '별내역' : '달내역'}({totalCnt}건)
        </button>
      </SelectWrap>
      <ListWrap>
        {Array.isArray(walletData) ? (
          walletData.map((data, index) => {
            const {contents, type, dalCnt, byeolCnt, updateDt, exchangeIdx} = data
            return (
              <div className="list" key={index}>
                <span className={`how-to-get type-${type}`}>{/* {selectWalletTypeData[walletType]['text']} */}</span>
                <span className="detail">
                  {contents}
                  {exchangeIdx > 0 ? (
                    <button className="exchangeCancelBtn" onClick={() => exchangeCancel(exchangeIdx)}>
                      취소
                    </button>
                  ) : (
                    ''
                  )}
                </span>
                <span className="type">
                  {formState.coinType === 'dal' ? dalCnt : byeolCnt}
                  <em>{returnCoinText(formState.coinType)}</em>
                </span>
                <span className="date">{timeFormat(updateDt)}</span>
              </div>
            )
          })
        ) : (
          <NoResult />
        )}
      </ListWrap>
    </ListContainer>
  )
}

const SearchList = styled.div`
  .search-list {
    height: 40px;
    border-radius: 8px;
    background-color: #eee;
    margin: 8px 0;
  }
`

const ListWrap = styled.div`
  margin-top: 8px;
  .list {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    height: 44px;
    padding: 10px 8px;
    user-select: none;
    margin-bottom: 1px;
    background-color: #fff;
    border-radius: 12px;
    span {
      transform: skew(-0.03deg);
    }

    .how-to-get {
      margin-left: 4px;
      font-size: 12px;
      line-height: 17px;
      color: #fff;
      width: 24px;
      height: 24px;
      border-radius: 8px;

      &.type-1 {
        background: url(${PurchaseIcon}) no-repeat center center / cover;
      }
      &.type-2 {
        background: url(${GiftPinkIcon}) no-repeat center center / cover;
      }
      &.type-3 {
        background: url(${ExchangeIcon}) no-repeat center center / cover;
      }
      &.type-4 {
        background: url(${MoneyIcon}) no-repeat center center / cover;
      }
    }
    .detail {
      width: calc(100% - 118px);
      text-align: left;
      padding-left: 8px;
      font-size: 14px;
      letter-spacing: -0.35px;
      font-weight: 600;
      text-align: left;
      color: #000000;
      .exchangeCancelBtn {
        width: 36px;
        height: 20px;
        margin-left: 4px;
        border-radius: 18px;
        background-color: #000;
        font-size: 11px;
        font-weight: 500;
        line-height: 20px;
        text-align: center;
        color: #fff;
      }
    }
    .type {
      line-height: 18px;
      width: 65px;
      color: #424242;
      font-size: 14px;
      font-weight: 600;
      text-align: right;
      color: #000000;
      > em {
        line-height: 18px;
        margin-left: 2px;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        letter-spacing: normal;
        color: #9e9e9e;
      }
    }
    .date {
      margin-left: auto;
      width: 44px;
      padding-right: 3px;
      font-size: 12px;
      line-height: 18px;
      color: #757575;
      text-align: right;
    }

    &.title {
      margin-top: 18px;
      color: #632beb;
      font-size: 14px;
      letter-spacing: -0.35px;
      border-color: #bdbdbd;
      border-top: 1px solid #632beb;

      .how-to-get {
        border: none;
        font-size: 14px;
      }
      .detail {
        text-align: center;
        padding-left: 0;
      }

      .how-to-get,
      .detail,
      .type,
      .date {
        color: #632beb;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .no-list {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 400px;

    img {
      display: block;
    }
  }
`

const TopArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;

  .title {
    width: 100%;
    .main {
      font-size: 16px;
      line-height: 18px;
      font-weight: 800;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
    }
    .sub {
      margin-left: 10px;
      font-size: 16px;
      line-height: 18px;
      font-weight: 400;
      letter-spacing: normal;
      text-align: left;
      color: #bdbdbd;
      float: right;
    }
  }

  .table__select {
  }
`

const SelectWrap = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  margin-top: 11px;
  padding: 0 8px;
  background-color: #fff;
  border-radius: 12px;
  & > button {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
  }
`

const ListContainer = styled.div`
  position: relative;
  margin-top: 19px;

  .mypage-wallet-select-box {
    z-index: 1;
    top: 0;
    right: 0;

    @media (max-width: ${WIDTH_MOBILE}) {
      top: -8px;
    }
  }
  .arrowBtn {
    display: block;
    position: absolute;
    top: -1px;
    right: 0;
    width: 24px;
    height: 24px;
    background: url(${ArrowDownIcon}) no-repeat center center / cover;
    z-index: 3;
  }
`
const Selector = styled.select`
  width: 56px;
  text-align: right;
  position: relative;
  background-color: transparent;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: left;
  color: #000000;
  z-index: 4;
`
