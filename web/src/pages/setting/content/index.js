import React, {useState, useEffect, useContext} from 'react'
import styled from 'styled-components'
//context
import {SettingStore} from '../store'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_PC, WIDTH_PC_S, WIDTH_TABLET, WIDTH_TABLET_S, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'
//ui
import Accordion from 'components/ui/accordian'
import Use from './use'
//
const Index = props => {
  //---------------------------------------------------------------------
  //context
  const store = useContext(SettingStore)
  Index.store = store
  //---------------------------------------------------------------------
  return (
    <Container>
      <h1>설정</h1>
      <div>
        {/* <Accordion title="알림설정" content={<h1>adasdas</h1>} /> */}
        <div className="accordian-box">
          <Accordion title="약관 및 정책">
            <Use />
          </Accordion>
        </div>

        {/* <Accordion title="로그아웃" content="3" />
        <Accordion title="회원 탈퇴" content="4" />
        <Accordion title="버전관리" content="5" /> */}
        <div>로그아웃</div>
        <div>회원탈퇴</div>
        <div>버전관리</div>
      </div>
    </Container>
  )
}
export default Index
//---------------------------------------------------------------------
/**
 * @title 스토어객체
 */
export const Store = () => {
  return Index.store
}
//---------------------------------------------------------------------
const Container = styled.div`
  width: 1210px;
  margin: 0 auto;
  & h1 {
    margin: 40px 0;
    text-align: center;
    color: ${COLOR_MAIN};
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.7px;
  }
  & .accordian-box {
    width: 600px;
    margin: 0 auto;
    @media (max-width: 1240px) {
      width: 95%;
    }
  }
  @media (max-width: 1240px) {
    width: 95%;
  }
`
