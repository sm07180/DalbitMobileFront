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

//pages

// import Guide from ' pages/common/layout/guide.js'

export default props => {
  //context
  const context = new useContext(Context)

  useEffect(() => {
    //방송방 페이지는 footer없음.
    context.action.updateState({footer: false})
    return () => {
      context.action.updateState({footer: true})
    }
  }, [])

  return (
    <Content>
      <Chat>{/* 채팅방 영역 */}여기서는 채팅을 입력할 수 있습니다!!</Chat>
      <Side>{/* side content 영역 */}이곳은 사이드 컨텐츠 영역으로 디테일한 방송 정보 등을 볼 수 있습니다!!!!!! </Side>
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

    @media (max-width: ${WIDTH_TABLET_S}) {
      height: calc(95vh - 64px);
    }
  }

  @media (max-width: 1260px) {
    width: 95%;
  }
`

const Chat = styled.div`
  /* width: 802px; */
  width: 66.28%;
  background: #dcceff;
  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
  }
`

const Side = styled.div`
  width: 33.71%;
  min-width: 408px;
  background: #8556f6;
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }
`
