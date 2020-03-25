/**
 * @file tab.js
 * @brief 고객센터 공통 탭
 *
 */
import React, {useState, useRef, useEffect} from 'react'
//styled-component
import styled from 'styled-components'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//context
import {Store} from './index'

export default props => {
  //----------------------------------------------------------------------------
  //info
  const tabInfo = [
    {
      id: 0,
      tab: '공지사항',
      type: 'notice'
    },
    {
      id: 1,
      tab: 'FAQ',
      type: 'faq'
    },
    {
      id: 2,
      tab: '1:1 문의',
      type: 'personal'
    }
    // {
    //   id: 3,
    //   tab: '방송 가이드',
    //   type: 'broadcast_guide'
    // }
  ]
  //makeContents
  const makeContents = () => {
    if (tabInfo === null) return
    return tabInfo.map((list, index) => {
      const {tab, type} = list
      return (
        <button onClick={() => Store().action.updateCode(type)} key={index} className={Store().menuCode === type ? 'on' : ''}>
          {tab}
        </button>
      )
    })
  }
  //----------------------------------------------------------------------------
  return (
    <Wrap>
      <div>{makeContents()}</div>
    </Wrap>
  )
}
//--------------------------------------------------------------------
const Wrap = styled.div`
  & > div {
    display: flex;
    margin-top: 59px;
    & button {
      flex: 1;
      height: 48px;
      border: 1px solid #e0e0e0;
      border-bottom: 1px solid ${COLOR_MAIN};
      border-right: none;
      color: ${COLOR_MAIN};
      &:nth-child(3) {
        border-right: 1px solid #e0e0e0;
      }
    }
    @media (max-width: ${WIDTH_MOBILE}) {
      margin-top: 30px;
    }
    & button.on {
      background-color: ${COLOR_MAIN};
      border: 1px solid ${COLOR_MAIN};
      color: #fff;
    }
  }
`
