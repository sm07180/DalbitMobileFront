/**
 * @title 404페이지
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components
import SlideContent from './SlideContent'

export default props => {
  //context
  const context = new useContext(Context)
  //state
  const [isSideOn, setIsSideOn] = useState(true)

  useEffect(() => {
    //방송방 페이지는 footer없음.
    context.action.updateState({isOnCast: true})
    return () => {
      context.action.updateState({isOnCast: false})
    }
  }, [])
  //tab
  const {currentItem, changeItem} = useTabs(0, tabConent)
  return (
    <Content className={isSideOn ? 'side-on' : 'side-off'}>
      <Chat>{/* 채팅방 영역 */}여기서는 채팅을 입력할 수 있습니다!!</Chat>
      <Side>
        {/* side content 영역 */}
        <button
          onClick={() => {
            setTimeout(() => {
              setIsSideOn(!isSideOn)
            }, 100)
          }}>
          사이드 영역 열고 닫기
        </button>
        <SlideContent>{/* <Charge /> */}</SlideContent>
      </Side>
    </Content>
  )
}
//tab------------------------------------------------------------------
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
  },
  {
    id: 3,
    tab: '프로필'
  }
]

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
//---------------------------------------------------------------------
//styled

const Content = styled.section`
  position: relative;
  width: 1210px;
  margin: 2.5vh auto 0 auto;

  & > * {
    height: calc(95vh - 80px);
    transition: width 0.5s ease-in-out;

    @media (max-width: ${WIDTH_TABLET_S}) {
      height: 100vh;
    }
  }

  &.side-off > div:first-child {
    width: calc(100% - 20px);
  }
  &.side-off > div:last-child {
    width: 20px;
  }

  @media (max-width: 1260px) {
    width: 95%;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    margin: 0;
  }
`

//채팅창 레이아웃
const Chat = styled.div`
  /* width: 802px; */
  width: 66.28%;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
  }
`
//side영역
const Side = styled.div`
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
  width: 408px;
  /* min-width: 408px; */
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }

  & > button {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 20px;
    background: #f2f2f2;
    transform: none;
    text-indent: -9999px;

    &:after {
      display: block;
      margin: 0 auto;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid #757575;
      content: '';
    }
  }
`

const SideContent = styled.div`
  padding-left: 20px;
  height: 100%;
`
