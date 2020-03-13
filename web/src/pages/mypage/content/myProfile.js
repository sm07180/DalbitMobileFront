/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component
 */

import React, {useEffect, useStet, useContext} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

//layout
import {WIDTH_PC, WIDTH_TABLET_S} from 'context/config'

// context
import {Context} from 'context'

const levelBarWidth = 176

const myProfile = props => {
  const context = useContext(Context)
  const {profile} = context

  return (
    <MyProfile>
      <ProfileImg style={{backgroundImage: `url(${profile.profImg ? profile.profImg['thumb190x190'] : ''})`}} />
      <ContentWrap>
        <LevelWrap>
          <LevelText>LEVEL {profile.level}</LevelText>
          <LevelStatusBarWrap>
            <LevelStatus style={{width: `calc(${(profile.level / 100) * levelBarWidth}% + 20px)`}}>{`${profile.level}%`}</LevelStatus>
          </LevelStatusBarWrap>
        </LevelWrap>

        <InfoWrap>
          <div>
            <span style={{color: '#424242', fontSize: '24px'}}>{profile.nickNm}</span>
            <span style={{marginLeft: '6px', verticalAlign: 'text-bottom', color: '#bdbdbd', fontSize: '14px'}}>{`@${profile.memId}`}</span>
          </div>
          <InfoConfigBtn>
            <Link to="/mypage/setting">내 정보 관리</Link>
          </InfoConfigBtn>
        </InfoWrap>

        <CountingWrap>
          <span>팬</span>
          <CoutingNumber>{profile.fanCnt}</CoutingNumber>
          <span style={{margin: '0 12px'}}>|</span>
          <span>스타</span>
          <CoutingNumber>{profile.starCnt}</CoutingNumber>
        </CountingWrap>

        <IntroduceAndFan>
          <div>{profile.profMsg}</div>
          <div></div>
        </IntroduceAndFan>
      </ContentWrap>
    </MyProfile>
  )
}

export default myProfile

const IntroduceAndFan = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #616161;
  font-size: 14px;
  margin-top: 16px;
`
const CoutingNumber = styled.span`
  font-size: 14px;
  color: #8555f6;
  letter-spacing: -0.35px;
  margin-left: 6px;
`

const CountingWrap = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 14px;
  letter-spacing: -0.35px;
  color: #707070;
  margin-top: 12px;
`

const InfoConfigBtn = styled.div`
  border: 1px solid #bdbdbd;
  border-radius: 18px;
  cursor: pointer;
  color: #9e9e9e;

  & > a {
    display: block;
    padding: 10px 20px;
    user-select: none;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }
`

const InfoWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 21px;
`

const LevelStatus = styled.div`
  height: 100%;
  border-radius: 10px;
  background-color: #8555f6;
  text-align: right;
  color: #fff;
  font-size: 9px;
  padding: 1px 0;
  padding-right: 6px;
  box-sizing: border-box;
`
const LevelStatusBarWrap = styled.div`
  width: 176px;
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
  margin-top: 20px;
`

const ContentWrap = styled.div`
  margin-left: 24px;
  width: calc(100% - 180px);

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    margin: 0 auto;

    & > div {
      display: flex;
      justify-content: center;
    }
  }
`

const ProfileImg = styled.div`
  display: block;
  width: 156px;
  height: 156px;
  background-size: cover;
  background-position: center;

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 126px;
    height: 126px;
    margin: 0 auto;
  }
`

const MyProfile = styled.div`
  display: flex;
  flex-direction: row;

  width: 600px;
  margin: 0 auto;
  padding: 30px;

  @media (max-width: ${WIDTH_PC}) {
    width: 90%;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-direction: column;
  }
`
