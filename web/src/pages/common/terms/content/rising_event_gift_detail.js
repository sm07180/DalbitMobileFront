/**
 * @file terms/content/event_gift_detail.js
 * @brief 이벤트 경품 상세소개
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'

////---------------------------------------------------------------------
export default (props) => {
  //---------------------------------------------------------------------
  return (
    <Content>
      <h2>경품 상세 소개</h2>

      <h3>{'<경품 상세 소개>'}</h3>
      <p>
        1) 삼성 올인원 PC(DM530ABE-L58A) 107만원 <br />
        2) 오디오인터페이스 + 고급마이크 세트 50만원
        <br />
        ※ 야마하 AG06 + 오디오테크니카 AT2020 + 관절스탠드
        <br />
        3) 삼성 JBL CHARGE4 블루투스스피커 18만원 <br />
        4) 갤럭시 Z플립 120만원 <br />
        5) 갤럭시탭S6 Lite LTE SM-P615 54만원
        <br />
        6) 갤럭시 워치 액티브2 27만원
      </p>

      <h3>{'<이벤트 유의사항>'}</h3>

      <ul>
        <li>가격은 정품 사이트 정품가격을 기준으로 합니다.</li>
        <li>현저한 가격변동이 있는 경우 대체상품으로 지급됩니다.</li>
      </ul>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div`
  p {
    font-size: 12px !important;
  }

  h2 {
    font-size: 16px !important;
    text-align: center !important;
    font-weight: bold !important;
  }

  h3 {
    font-size: 14px !important;
    color: #3a3a3a;
  }

  ul {
    li {
      position: relative;
      padding-left: 10px;
      font-size: 12px;
      line-height: 20px;

      &::before {
        content: '';
        position: absolute;
        top: 10px;
        left: 2px;
        width: 2px;
        height: 2px;
        background: #000;
      }

      .red {
        color: #ec455f;
      }

      .blue {
        color: #02a0db;
      }
    }
  }

  ol {
    li {
      position: relative;
      padding-left: 17px;
      line-height: 22px;

      span {
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
  ol.depth1 {
    margin-top: 20px;
  }
  ol.depth2 {
    & > li {
      margin-top: 16px;
      padding-left: 20px;
      color: #616161;
    }
  }
  ol.depth3 {
    margin-top: 6px;
    li {
      color: #616161;
    }
  }
  ol.depth4 {
    margin-bottom: 5px;
    li {
      padding-left: 9px;
      color: #616161;
    }
  }

  table.content {
    margin: 30px 0 8px 0;
    padding: 0;
    border-top: 1px solid ${COLOR_MAIN};
    caption {
      display: none;
    }
    * {
      color: #424242;
      font-size: 14px;
      text-align: center;
    }

    th,
    td {
      padding: 15px 5px;
      border-bottom: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
    }

    thead {
      th {
        background: #f5f5f5;
      }
      th:last-child {
        border-right: 0;
      }
    }

    tbody {
      td:last-child {
        border-right: 0;
      }
    }

    th.right-border,
    td.right-border {
      border-right: 1px solid #e0e0e0;
    }
  }

  span.table-txt {
    display: block;
    font-size: 14px;
    color: #9e9e9e;
    text-align: right;
  }
`
