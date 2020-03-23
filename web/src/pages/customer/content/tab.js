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

export default props => {
  const {currentItem, changeItem} = useTab(0, tabInfo)

  return (
    <Wrap>
      <div>
        {tabInfo.map((section, index) => (
          <button onClick={() => changeItem(index)} className={currentItem.id === index ? 'on' : ''} key={index}>
            {section.tab}
          </button>
        ))}
      </div>
      {currentItem.content}
    </Wrap>
  )
}

//style
//----------------------------------------------------------------------------
const useTab = (initialTab, allTabs) => {
  if (!allTabs || !Array.isArray(allTabs)) {
    return
  }
  const [currentIndex, setCurrentIndex] = useState(initialTab)
  return {
    currentItem: allTabs[currentIndex],
    changeItem: setCurrentIndex
  }
}
const tabInfo = [
  {
    id: 0,
    tab: '공지사항',
    content: <h1>dd</h1>
  },
  {
    id: 1,
    tab: 'FAQ',
    content: 'i am the content of the section2'
  },
  {
    id: 2,
    tab: '1:1 문의',
    content: 'i am the content of the section1'
  },
  {
    id: 3,
    tab: '방송 가이드',
    content: 'i am the content of the section1'
  }
]
//styled
//--------------------------------------------------------------------

const Wrap = styled.div`
  & > div {
    display: flex;
    margin-top: 59px;
    & button {
      width: 25%;
      height: 48px;
      border: 1px solid #e0e0e0;
      border-bottom: 1px solid ${COLOR_MAIN};
      border-right: none;
      color: ${COLOR_MAIN};
      &:nth-child(4) {
        border-right: 1px solid #e0e0e0;
      }
    }
    & button.on {
      background-color: ${COLOR_MAIN};
      border: 1px solid ${COLOR_MAIN};
      color: #fff;
    }
  }
`
