import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import SelectBox from 'components/ui/selectBox.js'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

import NoResult from 'components/ui/noResult'

export default props => {
  const {searching, coinType, walletData, returnCoinText, setWalletType} = props

  const selectWalletTypeData = [
    {value: 0, text: '전체'},
    {value: 1, text: '구매'},
    {value: 2, text: '선물'},
    {value: 3, text: '교환'}
  ]

  const timeFormat = strFormatFromServer => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date}`
  }

  return (
    <ListContainer>
      <SelectBox className="mypage-wallet-select-box" boxList={selectWalletTypeData} onChangeEvent={setWalletType} />
      <TopArea>
        <span className="title">
          <span className="main">{`${returnCoinText(coinType)} 상세내역`}</span>
          <span className="sub">(최근 6개월)</span>
        </span>
      </TopArea>

      <ListWrap>
        <div className="list title">
          <span className="how-to-get">구분</span>
          <span className="detail">내역</span>
          <span className="type">{returnCoinText(coinType)}</span>
          <span className="date">날짜</span>
        </div>

        {searching ? (
          <SearchList>
            {[...Array(10).keys()].map(idx => (
              <div className="search-list" key={idx} />
            ))}
          </SearchList>
        ) : Array.isArray(walletData) ? (
          walletData.map((data, index) => {
            const {contents, walletType, dalCnt, byeolCnt, updateDt} = data

            return (
              <div className="list" key={index}>
                <span className={`how-to-get type-${walletType}`}>{selectWalletTypeData[walletType]['text']}</span>
                <span className="detail">{contents}</span>
                <span className="type">{`${returnCoinText(coinType)} ${dalCnt !== undefined ? dalCnt : byeolCnt}`}</span>
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
  .list {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    height: 47px;
    user-select: none;

    span {
      transform: skew(-0.03deg);
    }

    .how-to-get {
      width: 32px;
      margin-left: 4px;
      border-radius: 15px;
      font-size: 12px;
      line-height: 17px;
      color: #fff;

      &.type-1 {
        background: ${COLOR_POINT_Y};
      }
      &.type-2 {
        background: ${COLOR_POINT_P};
      }
      &.type-3 {
        background: ${COLOR_MAIN};
      }
    }
    .detail {
      width: calc(100% - 176px);
      text-align: left;
      padding-left: 10px;
      font-size: 14px;
      letter-spacing: -0.35px;
      color: #424242;
    }
    .type {
      width: 65px;
      color: #424242;
      font-size: 14px;
      font-weight: 600;
    }
    .date {
      width: 75px;
      font-size: 14px;
      color: #bdbdbd;
      font-size: 12px;
    }

    &.title {
      margin-top: 26px;
      color: #8556f6;
      font-size: 14px;
      letter-spacing: -0.35px;
      border-color: #bdbdbd;
      border-top: 1px solid #8556f6;

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
        color: #8556f6;
        font-size: 12px;
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
      color: #8556f6;
      font-size: 20px;
      letter-spacing: -0.5px;

      @media (max-width: ${WIDTH_MOBILE}) {
        font-size: 18px;
        font-weight: 600;
      }
    }
    .sub {
      margin-left: 4px;
      color: #757575;
      font-size: 14px;
      letter-spacing: -0.35px;
    }
  }
`

const ListContainer = styled.div`
  position: relative;
  margin-top: 40px;

  .mypage-wallet-select-box {
    z-index: 1;
    top: 0;
    right: 0;

    @media (max-width: ${WIDTH_MOBILE}) {
      top: -8px;
    }
  }
`
