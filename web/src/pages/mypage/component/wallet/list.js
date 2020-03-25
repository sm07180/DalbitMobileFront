import React, {useState, useEffect} from 'react'
import styled from 'styled-components'

import SelectBox from 'components/ui/selectBox.js'

import {IMG_SERVER} from 'context/config'

export default props => {
  const {searching, type, data, returnCoinText, setWalletType} = props

  const selectBoxData = [
    {value: 0, text: '전체'},
    {value: 1, text: '구매'},
    {value: 2, text: '선물'},
    {value: 3, text: '교환'}
  ]

  return (
    <ListContainer>
      <SelectBox boxList={selectBoxData} onChangeEvent={setWalletType} inlineStyling={{right: 0, top: 0}} />
      <TopArea>
        <span className="title">
          <span className="main">{`${returnCoinText(type)} 상세내역`}</span>
          <span className="sub">(최근 6개월)</span>
        </span>
      </TopArea>

      <ListWrap>
        <div className="list title">
          <span className="how-to-get">구분</span>
          <span className="detail">내역</span>
          <span className="type">{returnCoinText(type)}</span>
          <span className="date">날짜</span>
        </div>

        {searching ? (
          <SearchList>
            {[...Array(10).keys()].map(idx => (
              <div className="search-list" key={idx} />
            ))}
          </SearchList>
        ) : Array.isArray(data) ? (
          [1, 2, 3, 4, 5, 6].map((value, index) => {
            return (
              <div className="list" key={index}>
                <span className="how-to-get">구매</span>
                <span className="detail">{`${type === 'dal' ? '달' : '별'} 직접 구매`}</span>
                <span className="type">{`${returnCoinText(type)} 100`}</span>
                <span className="date">2020.03.11 11:32</span>
              </div>
            )
          })
        ) : (
          <div className="no-list">
            <img src={`${IMG_SERVER}/images/api/img_noresult.png`} />
            <div>검색 결과가 없습니다.</div>
          </div>
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

    .how-to-get {
      width: 66px;
      border: 1px solid #000;
      border-radius: 15px;
      padding: 6px 16px;
      font-size: 14px;
    }
    .detail {
      width: calc(100% - 350px);
      text-align: left;
      box-sizing: border-box;
      padding-left: 20px;
      font-size: 14px;
      letter-spacing: -0.35px;
      color: #616161;
    }
    .type {
      width: 164px;
      color: #424242;
      font-size: 14px;
    }
    .date {
      width: 120px;
      font-size: 14px;
      color: #bdbdbd;
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
      }
      .detail {
        text-align: center;
        padding-left: 0;
      }
      .type,
      .date {
        color: #8556f6;
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
`
