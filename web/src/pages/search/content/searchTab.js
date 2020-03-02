/**
 * @title 서치(탭)
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
import Total from './total'

export default props => {
  //---------------------------------------------------------------------
  //context
  const context = useContext(Context)
  //---------------------------------------------------------------------
  //tab:탭클릭 index정의 state
  const {currentItem, changeItem} = useTabs(0, tabConent)
  //---------------------------------------------------------------------
  return (
    <>
      {/* 탭버튼 */}
      <Tab>
        {tabConent.map((section, index) => (
          <button onClick={() => changeItem(index)} key={index} className={currentItem.id === index ? 'on' : ''}>
            {section.tab}
          </button>
        ))}
      </Tab>
      {/* 탭컨텐츠영역 */}
      {currentItem.tab === '통합' && <Total />}
      {currentItem.tab === '사람' && <p>사람영역</p>}
      {currentItem.tab === '라이브' && <p>라이브영역</p>}
    </>
  )
}
//------------------------------------------------------------------
//tab function
const useTabs = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }
  const [currentIndex, SetCurrentIndex] = useState(initialTab)
  return {
    currentItem: allTabs[currentIndex],
    changeItem: SetCurrentIndex
  }
}
//------------------------------------------------------------------
//styled
const Tab = styled.div`
  margin-top: 50px;
  & button {
    width: 33.33%;
    height: 48px;
    display: inline-block;
    border: 1px solid #e0e0e0;
    border-bottom: 1px solid ${COLOR_MAIN};
    color: ${COLOR_MAIN};
    margin-left: -1px;
    &:first-child {
      margin-left: 0;
    }
    &.on {
      border: 1px solid ${COLOR_MAIN};
      background-color: ${COLOR_MAIN};
      color: white;
    }
  }
  & button:focus {
    outline: none;
  }
`
//------------------------------------------------------------------
//탭 셀렉트 배열
const tabConent = [
  {
    id: 0,
    tab: '통합'
  },
  {
    id: 1,
    tab: '사람'
  },
  {
    id: 2,
    tab: '라이브'
  }
]
