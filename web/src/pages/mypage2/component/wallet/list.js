import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import SelectBox from 'components/ui/selectBox.js'
import { COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P } from 'context/color'
import {
  IMG_SERVER,
  WIDTH_TABLET_S,
  WIDTH_PC_S,
  WIDTH_TABLET,
  WIDTH_MOBILE,
  WIDTH_MOBILE_S
} from 'context/config'

import NoResult from 'components/ui/noResult'
// svg
import ExBg from '../ex.svg'
import Live from '../ic_live.svg'
export default props => {
  const {
    searching,
    coinType,
    walletData,
    returnCoinText,
    setWalletType,
    controllState
  } = props

  const selectWalletTypeData = [
    { value: 0, text: '전체' },
    { value: 1, text: '구매' },
    { value: 2, text: '선물' },
    { value: 3, text: '교환' }
  ]

  const timeFormat = strFormatFromServer => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 2), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date}`
  }

  return (
    <ListContainer>
      <SelectBox
        className="mypage-wallet-select-box"
        boxList={selectWalletTypeData}
        onChangeEvent={setWalletType}
        controllState={controllState}
      />
      <TopArea>
        <span className="title">
          <span className="main">{`${returnCoinText(coinType)} 상세내역`}</span>
          <span className="sub">최근 6개월</span>
        </span>
      </TopArea>

      <ListWrap>
        {/* <div className="list title">
          <span className="how-to-get">구분</span>
          <span className="detail">내역</span>
          <span className="type">{returnCoinText(coinType)}</span>
          <span className="date">날짜</span>
        </div> */}

        {searching ? (
          <SearchList>
            {[...Array(10).keys()].map(idx => (
              <div className="search-list" key={idx} />
            ))}
          </SearchList>
        ) : Array.isArray(walletData) ? (
          walletData.map((data, index) => {
            const { contents, walletType, dalCnt, byeolCnt, updateDt } = data

            return (
              <div className="list" key={index}>
                <span className={`how-to-get type-${walletType}`}>
                  {/* {selectWalletTypeData[walletType]['text']} */}
                </span>
                <span className="detail">{contents}</span>
                <span className="type">
                  {dalCnt !== undefined ? dalCnt : byeolCnt}
                  <em>{returnCoinText(coinType)}</em>
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
        background: url(${ExBg}) no-repeat center center / cover;
      }
      &.type-2 {
        background: url(${Live}) no-repeat center center / cover;
      }
      &.type-3 {
        background: url(${ExBg}) no-repeat center center / cover;
      }
    }
    .detail {
      width: calc(100% - 124px);
      text-align: left;
      padding-left: 8px;
      font-size: 14px;
      letter-spacing: -0.35px;
      font-weight: 600;
      text-align: left;
      color: #000000;
    }
    .type {
      width: 65px;
      color: #424242;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      color: #000000;
      > em {
        margin-left: 2px;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        letter-spacing: normal;
        color: #000000;
      }
    }
    .date {
      margin-left: auto;
      width: 50px;
      font-size: 12px;
      color: #000;
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
  flex-direction: row;

  .title {
    .main {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
    }
    .sub {
      margin-left: 10px;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: left;
      color: #632beb;
    }
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
`
