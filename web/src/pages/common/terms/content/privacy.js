/**
 * @file terms/content/privacy.js
 * @brief 개인정보 처리방침
 * @todo 컨텐츠 내용 업데이트
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Privacy from 'pages/customer/content/app_info/privacy'
////---------------------------------------------------------------------
export default (props) => {
  //context
  const context = useContext(Context)

  //---------------------------------------------------------------------
  return <Privacy />
}

//---------------------------------------------------------------------
//styled
const Content = styled.div`
  color: #616161 !important;
  ol {
    li {
      position: relative;
      padding-left: 15px;
    }
    li:before {
      position: absolute;
      left: 0;
    }
  }
  ol.depth1 {
    margin-top: 20px;
    counter-reset: depth1;
    & > li {
      margin-top: 20px;
      padding-left: 26px;
    }
    & > li:before {
      display: block;
      width: 20px;
      text-align: right;
      counter-increment: depth1;
      font-weight: bold;
      content: counter(depth1) '.';
    }

    &.no-space {
      li {
        margin-top: 0;
      }
      li:before {
        font-weight: normal !important;
      }
    }
  }
  ol.depth2 {
    margin-left: 20px;
    margin-top: 10px;
    list-style-type: hangul;
    & > li {
      margin-top: 10px;
      padding-left: 0;
      color: #616161;
    }
  }

  ol.num {
    margin-top: 5px;
    counter-reset: depth2;
    & > li {
      margin-top: 5px;
      padding-left: 19px;
      color: #616161;
    }
    & > li:before {
      display: block;
      width: 14px;
      text-align: right;
      counter-increment: depth2;
      content: counter(depth2) ')';
    }
  }
  ol.depth3 {
    /* margin-left: -15px; */

    li {
      color: #616161;
      text-align: left !important;
    }
    li:before {
      left: 4px;
      content: '-';
    }
  }
`
