/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component
 */

import React, {useEffect, useStet, useContext} from 'react'
import {Link} from 'react-router-dom'
import styled from 'styled-components'

// context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {IMG_SERVER, WIDTH_TABLET_S, WIDTH_PC_S, WIDTH_TABLET, WIDTH_MOBILE, WIDTH_MOBILE_S} from 'context/config'

const levelBarWidth = 176

const myProfile = props => {
  const {profile} = props

  if (profile === null) {
    return null
  }

  return (
    <MyProfile>
      <ButtonWrap>
        <InfoConfigBtn>
          <Link to="/mypage/setting">내 정보 관리</Link>
        </InfoConfigBtn>
        <FanListWrap>
          {profile.fanRank.map((fan, index) => {
            return (
              <FanRank key={index} style={{backgroundImage: `url(${fan.profImg['thumb88x88']})`}}>
                <Link to={`/mmypage/${fan.memNo}`} />
              </FanRank>
            )
          })}
        </FanListWrap>
      </ButtonWrap>

      <ProfileImg url={profile.profImg ? profile.profImg['thumb190x190'] : ''}>
        <figure>
          <img src={profile.profImg ? profile.profImg['thumb190x190'] : ''} alt={profile.nickNm} />
        </figure>
        <span>
          {profile.grade} / Lv.{profile.level}
        </span>
      </ProfileImg>

      <ContentWrap>
        <LevelWrap>
          <LevelText>LEVEL {profile.level}</LevelText>
          <LevelStatusBarWrap>
            <LevelStatus
              style={{width: `calc(${(profile.level / 100) * levelBarWidth}% + 20px)`}}>{`${profile.level}%`}</LevelStatus>
          </LevelStatusBarWrap>
        </LevelWrap>

        <NameWrap>
          <strong>{profile.nickNm}</strong>
          <span>{`@${profile.memId}`}</span>
        </NameWrap>

        <CountingWrap>
          <span>
            팬 <em>{profile.fanCnt}</em>
          </span>
          <span>
            스타 <em>{profile.starCnt}</em>
          </span>
        </CountingWrap>

        <ProfileMsg>{profile.profMsg}</ProfileMsg>
      </ContentWrap>
    </MyProfile>
  )
}

export default myProfile

//최상단 flex wrap
const MyProfile = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  margin: 0 auto;
  padding: 40px 16px 57px 16px;

  * > div {
    flex: 0 0 auto;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-direction: column;
    padding: 0 0 45px 0;
  }
`
//flex item3
const ButtonWrap = styled.div`
  flex-basis: 204px;
  padding-top: 35px;
  text-align: right;
  order: 3;
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: flex;
    justify-content: space-between;
    flex-basis: auto;
    padding-top: 0;
    order: 1;
  }
`

const ProfileImg = styled.div`
  display: block;
  position: relative;
  height: 156px;
  flex-basis: 156px;
  background-size: cover;
  background-position: center;
  text-align: center;
  order: 1;

  figure {
    width: 120px;
    height: 120px;
    margin: 6px auto 0 auto;
    border-radius: 50%;
    background: url(${props => props.url}) no-repeat center center/ cover;

    img {
      display: none;
    }
  }

  span {
    display: inline-block;
    position: relative;
    padding: 0 13px;
    border-radius: 30px;
    background: ${COLOR_POINT_Y};
    color: #fff;
    font-size: 12px;
    line-height: 30px;
    z-index: 2;
    transform: skew(-0.03deg);
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 10px;
    order: 2;
  }
`

const ContentWrap = styled.div`
  width: calc(100% - 360px);
  padding: 0 24px;
  order: 2;

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 100%;
    margin: 0 auto;
    order: 3;

    & > div {
      display: flex;
      justify-content: center;
    }
  }
`
//------------------------------------------------------
//정보 레벨업관련
const LevelWrap = styled.div`
  display: flex;
  flex-direction: row;
  height: 16px;
  margin-top: 3px;

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 10px;
    align-items: center;
  }
`
const LevelText = styled.span`
  color: ${COLOR_MAIN};
  font-size: 14px;
  line-height: 18px;
  font-weight: 800;
  letter-spacing: -0.35px;
  transform: skew(-0.03deg);
  @media (max-width: ${WIDTH_TABLET_S}) {
    display: none;
  }
`
const LevelStatusBarWrap = styled.div`
  position: relative;
  width: 156px;
  margin-left: 8px;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  @media (max-width: ${WIDTH_TABLET_S}) {
    height: 14px;
  }
`
const LevelStatus = styled.div`
  position: absolute;
  top: -1px;
  left: -1px;
  height: calc(100% + 2px);
  border-radius: 10px;
  background-color: ${COLOR_MAIN};
  text-align: right;
  color: #fff;
  font-size: 9px;
  padding: 1px 0;
  padding-right: 6px;
  line-height: 15px;
  box-sizing: border-box;
  @media (max-width: ${WIDTH_TABLET_S}) {
    line-height: 13px;
  }
`
//닉네임
const NameWrap = styled.div`
  margin-top: 21px;
  & > * {
    display: inline-block;
  }
  strong {
    color: #424242;
    font-size: 24px;
    line-height: 32px;
    font-weight: 800;
  }
  span {
    padding-left: 5px;
    color: #bdbdbd;
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    display: block !important;
    text-align: center;
    & > * {
      display: block;
    }
    span {
      padding: 2px 0 0 0;
    }
  }
`
//팬, 스타 수
const CountingWrap = styled.div`
  margin-top: 12px;
  span {
    display: inline-block;
    font-size: 14px;
    letter-spacing: -0.35px;
    color: #707070;
    transform: skew(-0.03deg);

    em {
      display: inline-block;
      padding-left: 1px;
      color: ${COLOR_MAIN};
      font-style: normal;
      font-weight: 600;
    }
  }
  & span:first-child:after {
    display: inline-block;
    width: 1px;
    height: 12px;
    margin: 0 11px -1px 12px;
    background: #e0e0e0;
    content: '';
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 16px;
  }
`
//프로필메세지
const ProfileMsg = styled.p`
  margin-top: 16px;
  color: #616161;
  font-size: 14px;
  line-height: 20px;
  transform: skew(-0.03deg);
  @media (max-width: ${WIDTH_TABLET_S}) {
    text-align: center;
  }
`
//상단버튼
const InfoConfigBtn = styled.div`
  & > a {
    display: inline-block;
    padding: 0 20px;
    user-select: none;
    border: 1px solid #bdbdbd;
    border-radius: 18px;
    font-size: 14px;
    line-height: 36px;
    color: #9e9e9e;
    cursor: pointer;
  }

  a + a {
    margin-left: 4px;
  }
`
//팬랭킹
const FanListWrap = styled.div`
  display: block;
  margin-top: 33px;

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 0;
  }
`
const FanRank = styled.div`
  display: inline-block;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  & > a {
    display: block;
    width: 100%;
    height: 100%;
  }

  & + & {
    margin-left: 4px;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    width: 36px;
    height: 36px;
  }
`
