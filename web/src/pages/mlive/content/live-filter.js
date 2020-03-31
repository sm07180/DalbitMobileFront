/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useMemo, useContext} from 'react'
import styled from 'styled-components'
//context
import {Store} from './index'
import {COLOR_MAIN} from 'context/color'
//components
import Api from 'context/api'
import SelectBox from 'components/ui/selectBox'
import {GetBroadList} from './live-index'
//pages
//
export default props => {
  //랭킹
  const searchType = useMemo(() => {
    return [
      {value: -1, text: '전체'},
      {value: 1, text: '추천'},
      {value: 2, text: '인기'},
      {value: 3, text: '신입'}
    ]
  })
  //방송주제
  const roomType = useMemo(() => {
    return [
      {value: '', text: '전체'},
      {value: '00', text: '일상/챗'},
      {value: '01', text: '노래/연주'},
      {value: '02', text: '고민/사연'},
      {value: '03', text: '연애/오락'},
      {value: '04', text: '책/힐링'},
      {value: '05', text: 'ASMR'},
      {value: '06', text: '노래방'},
      {value: '07', text: '성우'},
      {value: '08', text: '스터디'},
      {value: '09', text: '공포'},
      {value: '10', text: '먹방/요리'},
      {value: '11', text: '건강/스포츠'},
      {value: '99', text: '기타'}
    ]
  })
  //---------------------------------------------------------------------
  return (
    <Content>
      <h1>실시간 LIVE</h1>
      <div className="in_wrap">
        {/* 추천/인기/신입 */}
        <section className="type1">
          <SelectBox
            inlineStyling={{zIndex: '1', backgrond: '#fff'}}
            boxList={searchType}
            onChangeEvent={value => {
              Store().action.updateCurrentPage(1)
              Store().action.updateSearchType(value)
            }}
          />
        </section>
        {/* 일상/챗 */}
        <section className="type2">
          <SelectBox
            inlineStyling={{zIndex: '1', backgrond: '#fff'}}
            boxList={roomType}
            onChangeEvent={value => {
              Store().action.updateCurrentPage(1)
              Store().action.updateRoomType(value)
            }}
          />
        </section>
      </div>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  display: block;
  & > h1 {
    display: block;
    margin-top: 24px;
    padding-bottom: 4px;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: left;
  }
  .in_wrap {
    position: relative;
    display: block;
    width: 100%;
    padding-bottom: 45px;
    box-sizing: border-box;

    /* 드롭다운메뉴CSS정리 */
    section {
      display: inline-block;
      width: 48%;
      box-sizing: border-box;
      text-align: left;
      &.type1 {
        margin-right: 2%;
      }
      .wrapper {
        width: 48%;
        .options {
          width: 100%;
        }
      }
    }
    &:after {
      display: block;
      clear: both;
      content: '';
    }
  }
`
//---------------------------------------------------------------------
