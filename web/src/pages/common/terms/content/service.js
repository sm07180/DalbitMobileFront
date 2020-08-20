/**
 * @file terms/content/service.js
 * @brief 서비스 이용약관
 * @todo 컨텐츠 내용 업데이트
 */
import React, {useEffect, useContext, useState} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

////---------------------------------------------------------------------
import Service from 'pages/customer/content/app_info/service'
export default (props) => {
  //context
  const context = useContext(Context)

  //---------------------------------------------------------------------
  return <Service />
}

//---------------------------------------------------------------------
//styled
const Content = styled.div`
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
      padding-left: 26px;
      margin-top: 16px;
      color: #616161;
    }
    li:before {
      width: 20px;
      text-align: right;
      counter-increment: depth1;
      content: counter(depth1) '.';
    }
  }
  ol.depth2 {
    margin-left: -17px;
    counter-reset: depth2;
    & > li {
      padding-left: 26px;
      margin-top: 6px;
      color: #616161;
    }
    li:before {
      width: 20px;
      text-align: right;
      counter-increment: depth2;
      content: counter(depth2) ')';
    }
  }
  ol.depth3 {
    margin-top: 6px;
    margin-left: -15px;
    counter-reset: depth3;
    li {
      color: #616161;
    }
    li:before {
      counter-increment: depth3;
      content: counter(depth3);
    }
  }
  ol.depth4 {
    margin-left: -15px;
    li {
      color: #616161;
    }
    li:before {
      left: 4px;
      content: '-';
    }
  }
`
