/**
 * @file /ranking/content/index.js
 * @brief 랭킹
 */
import React, {useState, useEffect, useContext, useRef} from 'react'
import styled from 'styled-components'

//context
import {Context} from 'context'
import Api from 'context/api'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

//component
import RankList from './rankList'
import Figure from './Figure'

//
export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  /**
   *
   * @returns
   */

  //---------------------------------------------------------------------
  return (
    <Contents>
      <h2>랭킹</h2>
      <div className="filter">
        <div className="rank-type">
          <button>달D랭킹</button>
          <button>팬랭킹</button>
        </div>
        <div className="date-type">
          <button>전일</button>
          <button>주간</button>
          <button>월간</button>
        </div>
      </div>
      <div className="my-rank">
        <h3>
          <span>100</span>
        </h3>
        <Figure url="https://www.mbcsportsplus.com/data/board/attach/2019/09/20190922103929_fklrgnkf.jpg" />
        <div>
          <strong>Lv 300</strong>
          <p>트와이스 😎 feel special</p>
        </div>
      </div>
      <RankList />
    </Contents>
  )
}
//---------------------------------------------------------------------

const Contents = styled.div`
  width: 1210px;
  min-height: 300px;
  margin: 0 auto;
  padding: 40px 0 120px 0;
  h2 {
    padding-bottom: 60px;
    font-size: 28px;
    font-weight: 600;
    color: ${COLOR_MAIN};
    text-align: center;
  }

  /* 내 랭킹 */
  .my-rank {
    display: flex;
    margin-top: 18px;
    padding: 12px;
    border-radius: 10px;
    background: #f5f5f5;

    & > * {
      flex: 0 0 auto;
    }

    h3 {
      flex-basis: 80px;
      line-height: 80px;
      text-align: center;
      span {
        display: inline-block;
        width: 32px;
        line-height: 32px;
        border-radius: 50%;
        background: #424242;
        color: #fff;
        font-size: 14px;
        font-weight: 800;
        vertical-align: middle;
        transform: skew(-0.03deg);
        z-index: -1;
      }
    }
  }

  @media (max-width: 1260px) {
    width: 95%;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    h2 {
      padding-bottom: 26px;
      font-size: 24px;
    }
  }
`
