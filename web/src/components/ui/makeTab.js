/**
 * @title 사이드 컨텐츠(탭)
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

export default props => {
  const [roomInfo, setRoomInfo] = useState({...props.location.state})
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
      {currentItem.tab === '청취자' && <p>1111</p>}
      {currentItem.tab === '게스트' && <p>1112</p>}
      {currentItem.tab === '라이브' && <p>1113</p>}
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
  & button {
    width: 25%;
    height: 48px;
    display: inline-block;
    border: 1px solid #e0e0e0;
    border-bottom: 1px solid ${COLOR_MAIN};
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
    tab: '청취자'
  },
  {
    id: 1,
    tab: '게스트'
  },
  {
    id: 2,
    tab: '라이브'
  }
]
