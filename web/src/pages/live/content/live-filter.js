/**
 * @file /mlive/index.js
 * @brief 라이브방송
 */
import React, {useMemo, useContext} from 'react'
import styled from 'styled-components'
//context
import {Store} from './index'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//static image
import Reload from '../static/ic_refresh.svg'
import Arrow from '../static/ic_arrow_down_color.svg'

export default props => {
  //---------------------------------------------------------------------
  return (
    <Content>
      <section>
        <button
          onClick={() => {
            Store().action.updateSearchType('-1')
            Store().action.updateRoomType('')
            Store().action.updateReload()
          }}
          className="reload">
          <i className="trans">
            <img src={Reload} />
          </i>
          새로고침
        </button>
        <div className="in_wrap">
          <span className="wrapper type1">
            <select
              dir="rtl"
              className="search"
              name="searchType"
              value={Store().searchType}
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
            <i>
              <img src={Arrow} />
            </i>
          </span>
          <span className="wrapper type2">
            <select
              dir="rtl"
              className="room"
              name="roomType"
              value={Store().roomType}
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
            <i>
              <img src={Arrow} />
            </i>
          </span>
        </div>
      </section>
    </Content>
  )
}
//---------------------------------------------------------------------
const Content = styled.div`
  display: block;
  margin-bottom: 10px;
  & > h1 {
    padding-bottom: 26px;
    font-size: 24px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }
  section {
    position: relative;
    display: block;
    padding: 10px 0;
    border-radius: 20px;

    background-color: #f5f5f5;
    .reload {
      display: inline-block;
      margin-left: 10px;
      color: #bdbdbd;
      font-size: 14px;

      @media (hover: hover) {
        &:hover {
          color: #000;
          font-weight: bold;
        }
      }

      i {
        display: inline-block;
        padding-right: 5px;
      }
    }
    .in_wrap {
      position: absolute;
      top: 50%;
      right: 8%;
      transform: translatey(-50%);
      .wrapper {
        position: relative;
        i {
          position: absolute;
          right: -5px;
          display: inline-block;
          padding: 10px 0;
          z-index: -1;
        }
      }
      select {
        display: inline-block;
        -webkit-appearance: none;
        padding: 10px 15px;
        color: #424242;
        font-size: 14px;
        letter-spacing: -0.35px;
        background: transparent;
      }
    }
  }
`
//---------------------------------------------------------------------
