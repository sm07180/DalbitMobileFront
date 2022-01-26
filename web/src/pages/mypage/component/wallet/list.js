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
      <section className="optionWrap">
        <div className="option">
          <div className="selectBox"
            onClick={() => {
              setShowFilter(true)
            }}>
            <button>
              {isFiltering === false ? '전체' : formState.coinType === 'byeol' ? '별내역' : '달내역'}
              <img src={ArrowDownIcon} />
            </button>
          </div>
          <span className="sub">최근 6개월 이내</span>
        </div>
      </section>
      <section className="listWrap">
        {Array.isArray(walletData) ? (
          walletData.map((data, index) => {
            const {contents, type, dalCnt, byeolCnt, updateDt, exchangeIdx} = data
            return (
              <div className="list" key={index}>
                <div className="detail">
                  <div className="contentBox">
                    {contents}
                    {exchangeIdx > 0 ? (
                      <button className="exchangeCancelBtn" onClick={() => exchangeCancel(exchangeIdx)}>
                        취소하기
                      </button>
                    ) : (
                      ''
                    )}
                    <span className="privateBtn">몰래</span>
                  </div>
                  <span className="date">{timeFormat(updateDt)}</span>
                </div>
                <span className="type">
                  {formState.coinType === 'dal' ? dalCnt : byeolCnt}
                </span>
                
              </div>
            )
          })
        ) : (
          <NoResult />
        )}
      </section>
    </ListContainer>
  )
}

const ListContainer = styled.div`
  position: relative;
  margin-top: 19px;
  .option{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-top: 11px;
    padding:0 16px;
    height:28px;
    .selectBox{
      font-size:15px;
      font-weight:400;
      & > button {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
      }
    }
    span {
      font-size: 13px;
      font-weight: 400;
      color: #666;
    }
  }
  .listWrap{
    .list {
      display: flex;
      flex-direction: row;
      align-items: center;
      width:100%;
      height: 65px;
      text-align: center;
      border-bottom: 1px solid #f5f5f5;
      padding: 0 16px;
      .detail {
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        width: calc(100% - 100px);
        flex:none;
        font-size: 15px;
        font-weight: 500;
        .contentBox{
          dispaly:flex;
          align-items:center;
          .exchangeCancelBtn {
            width:55px
            height: 22px;
            margin-left: 4px;
            border-radius: 11px;
            background-color: #FF3C7B;
            font-size: 12px;
            text-align: center;
            color: #fff;
          }
          .privateBtn{
            height:16px;
            line-height:16px;
            background:#999999;
            border-radius:20px;
            font-size:12px;
            color:#fff;
            text-align:center;
            margin-left:4px;
            padding:0 4px;
          }
        }
      }
      .type {
        font-size: 17px;
        color: #000000;
        margin-left:auto;
      }
      .date {
        font-size: 12px;
        color: #707070;
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
