/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component
 */

import React, {useEffect, useStet} from 'react'
import styled from 'styled-components'

//layout
import {WIDTH_PC, WIDTH_TABLET} from 'context/config'

const myProfile = props => {
  return (
    <MyProfile>
      <ProfileImg />
      <div style={{width: '100%'}}>
        <LevelWrap>
          <LevelText>LEVEL 12</LevelText>
          <LevelStatusBarWrap>
            <LevelStatus />
          </LevelStatusBarWrap>
        </LevelWrap>

        <InfoWrap>
          <div>
            <span style={{color: '#424242', fontSize: '24px'}}>DJ라디오라디오</span>
            <span style={{verticalAlign: 'text-bottom'}}>@dalbit</span>
          </div>
          <InfoConfigBtn>내 정보 관리</InfoConfigBtn>
        </InfoWrap>

        <div className="fan-and-start-text">
          <span>팬</span>
          <span>12k</span>
          <span>스타</span>
          <span>870</span>
        </div>

        <IntroduceAndFan>
          <div>불러주는 진짜 사연 라디오</div>
          <div></div>
        </IntroduceAndFan>
      </div>
    </MyProfile>
  )
}

export default myProfile

const IntroduceAndFan = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const InfoConfigBtn = styled.div`
  padding: 10px 20px;
  border: 1px solid #bdbdbd;
  border-radius: 18px;
  cursor: pointer;
  color: #9e9e9e;
`

const InfoWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const LevelStatus = styled.div`
  border-radius: 10px;
  background-color: #8555f6;
`
const LevelStatusBarWrap = styled.div`
  width: 156px;
  margin-left: 10px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
`
const LevelText = styled.span`
  color: #8555f6;
  font-size: 14px;
  letter-spacing: -0.35px;
`
const LevelWrap = styled.div`
  display: flex;
  flex-direction: row;
`

const ProfileImg = styled.img`
  display: block;
`

const MyProfile = styled.div`
  display: flex;
  flex-direction: row;

  width: 600px;
  margin: 0 auto;
  padding: 30px;
  min-height: 300px;

  @media (max-width: ${WIDTH_PC}) {
    width: 90%;
  }
`
