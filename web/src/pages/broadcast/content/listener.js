/**
 * @title 방송방화면
 *
 */
import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//components
import Charge from './charge'
import NaviBar from './navibar'

//pages

// import Guide from ' pages/common/layout/guide.js'

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

  return (
    <Content className={isSideOn ? 'side-on' : 'side-off'}>
      <Chat>{/* 채팅방 영역 */}여기서는 채팅을 입력할 수 있습니다!!</Chat>
      <Side>
        {/* side content 영역 */}
        <button>사이드 영역 열고 닫기</button>
        <SideContent>
          <NaviBar title={'타이틀'} />
          <Charge />
        </SideContent>
      </Side>
    </Content>
  )
}

//---------------------------------------------------------------------
//styled

const Content = styled.section`
  display: flex;
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
  display: flex;
  width: 33.71%;
  min-width: 408px;
  background: #8556f6;
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }

  & > button {
    height: calc(100% + 1px);
    width: 20px;
    background: #f2f2f2;
    transform: none;
    text-indent: -9999px;

    &:after {
      display: block;
      width: 10px;
      height: 10px;
      margin: 0 auto;
      background: #757575;
      content: '';
    }
  }
`

const SideContent = styled.div`
  width: calc(100% - 20px;);
`
