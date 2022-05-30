/**
 * @file terms/content/event_gift_detail.js
 * @brief 이벤트 경품 상세소개
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'

////---------------------------------------------------------------------
export default (props) => {
  //---------------------------------------------------------------------
  return (
    <div>
      {/* // <Content>
    //   <h2>굿즈 상품 미리보기</h2>

    //   <p>
    //     <img src={'https://image.dallalive.com/event/2007/24/goods_img_640.jpg'} />
    //   </p>
    // </Content> */}
    </div>
  )
}

//---------------------------------------------------------------------
//styled
const Content = styled.div`
  p {
    font-size: 12px !important;
  }

  p img {
    width: 100%;
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
