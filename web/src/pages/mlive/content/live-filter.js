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

//static image
import Reload from '../static/ic_refresh.svg'
import Arrow from '../static/ic_arrow_down_color.svg'

export default props => {
  //---------------------------------------------------------------------
  return (
    <Content>
      <h1>실시간 LIVE</h1>
      <section>
        <button
          onClick={() => {
            Store().action.updateReload()
          }}
          className="reload">
          <i>
            <img src={Reload} />
          </i>
          새로고침
        </button>
        <div className="in_wrap">
          <span className="wrapper">
            <i>
              <img src={Arrow} />
            </i>
            <select
              className="search"
              name="searchType"
              onChange={() => {
                const _val = event.target.value
                Store().action.updateCurrentPage(1)
                Store().action.updateSearchType(_val)
              }}>
              <option value="-1">전체</option>
              <option value="1">추천</option>
              <option value="2">인기</option>
              <option value="3">신입</option>
            </select>
          </span>
          <span className="wrapper">
            <i>
              <img src={Arrow} />
            </i>
            <select
              className="room"
              name="roomType"
              onChange={event => {
                const _val = event.target.value
                Store().action.updateCurrentPage(1)
                Store().action.updateRoomType(_val)
              }}>
              <option value="">전체</option>
              <option value="00">일상/챗</option>
              <option value="01">노래/연주</option>
              <option value="02">고민/사연</option>
              <option value="03">연애/오락</option>
              <option value="04">책/힐링</option>
              <option value="05">ASMR</option>
              <option value="06">노래방</option>
              <option value="07">성우</option>
              <option value="08">스터디</option>
              <option value="09">공포</option>
              <option value="10">먹방/요리</option>
              <option value="11">건강/스포츠</option>
              <option value="99">기타</option>
            </select>
          </span>
        </div>
      </section>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  display: block;
  font-family: 'san-serif';
  margin-bottom: 10px;
  & > h1 {
    display: block;
    margin-top: 24px;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.17;
    letter-spacing: -0.36px;
    text-align: left;
    color: #424242;
  }
  section {
    position: relative;
    display: block;
    padding: 10px 0;
    border-radius: 20px;
    line-height: 17px;
    background-color: #f5f5f5;
    .reload {
      display: inline-block;
      margin-left: 10px;
      color: #bdbdbd;
      font-size: 14px;
    }
    .in_wrap {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translatey(-50%);
      select {
        display: inline-block;
        padding: 10px 10px 10px 5px;
      }
    }
    .wrapper {
      i {
        display: inline-block;
        padding: 10px 0;
      }
    }
    select {
      display: inline-block;
      -webkit-appearance: none;
      color: #424242;
      font-size: 14px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.14;
      letter-spacing: -0.35px;
      background: transparent;
    }
  }
`
//---------------------------------------------------------------------
