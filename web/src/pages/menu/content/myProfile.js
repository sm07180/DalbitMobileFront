/**
 * @file /mypage/content/my-profile.js
 * @brief 마이페이지 상단에 보이는 내 프로필 component.
 */
import React, {useEffect, useStet, useContext, useState} from 'react'
//route
import {Link} from 'react-router-dom'
import {OS_TYPE} from 'context/config.js'
//styled
import styled from 'styled-components'
//component
import ProfileReport from './profile_report'
import ProfileFanList from './profile_fanList'
// import ProfilePresent from './profile_present'
// context
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P} from 'context/color'
import {WIDTH_TABLET_S, IMG_SERVER} from 'context/config'
import Api from 'context/api'
import {Context} from 'context'
//svg
import LiveIcon from '../component/ic_live.svg'

const levelBarWidth = 176

const myProfile = props => {
  const {webview} = props

  //context
  const ctx = useContext(Context)
  const context = useContext(Context)
  //pathname
  const urlrStr = props.location.pathname.split('/')[2]
  const {profile} = props

  let expCalc = Math.floor((profile.expNext - profile.expBegin) / (profile.exp - profile.expBegin))
  if (expCalc == 'Infinity') expCalc = 0

  const myProfileNo = ctx.profile.memNo
  //state
  const [reportShow, SetShowReport] = useState(false)
  if (profile === null) {
    return <div style={{minHeight: '400px'}}></div>
  }
  //api
  async function fetchDataFanRegist(myProfileNo) {
    const res = await Api.fan_change({
      data: {
        memNo: myProfileNo
      }
    })
    if (res.result === 'success') {
      context.action.alert({
        callback: () => {
          context.action.updateMypageFanCnt(myProfileNo)
        },
        msg: '팬등록에 성공하였습니다.'
      })
      //console.log(res)
    } else if (res.result === 'fail') {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }
  //function:팬해제
  const Cancel = myProfileNo => {
    async function fetchDataFanCancel(myProfileNo) {
      const res = await Api.mypage_fan_cancel({
        data: {
          memNo: myProfileNo
        }
      })
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            context.action.updateMypageFanCnt(myProfileNo + 1)
          },
          msg: '팬등록을 해제하였습니다.'
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataFanCancel(myProfileNo)
  }
  //function:팬등록
  const fanRegist = myProfileNo => {
    fetchDataFanRegist(myProfileNo)
  }
  //func
  const starContext = () => {
    if (profile.starCnt > 0) {
      context.action.updateCloseStarCnt(true)
    }
  }
  const fanContext = () => {
    if (profile.fanCnt > 0) {
      context.action.updateCloseFanCnt(true)
    }
  }
  const createFanList = () => {
    if (profile.fanRank == false) return null
    let result = []
    for (let index = 0; index < 3; index++) {
      if (profile.fanRank[index] == undefined) {
        // let thisRank = index + 1
        // result = result.concat(
        //   <a key={index}>
        //     <FanRank
        //       style={{backgroundImage: `url(${IMG_SERVER}/images/api/default_fan${index + 1}.png)`}}
        //       className={`rank${thisRank}`}></FanRank>
        //   </a>
        // )
      } else {
        const {memNo, profImg, rank} = profile.fanRank[index]
        let link = ''
        if (memNo == myProfileNo) {
          link = `/menu/profile`
        } else {
          link = webview ? `/mypage/${memNo}/initial?webview=${webview}` : `/mypage/${memNo}`
        }
        result = result.concat(
          <a href={link} key={index}>
            <FanRank style={{backgroundImage: `url(${profImg.thumb88x88})`}} className={`rank${rank}`}></FanRank>
          </a>
        )
      }
    }
    result = result.concat(
      <button className="moreFan" onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)} key="btn">
        <span></span>
      </button>
    )
    return (
      <>
        <FanListWrap>
          <span>팬 랭킹</span>
          {result}
        </FanListWrap>
      </>
    )
  }

  return (
    <MyProfile webview={webview}>
      <ProfileImg url={profile.profImg ? profile.profImg['thumb190x190'] : ''}>
        {profile.roomNo !== '' && <div className="liveIcon"></div>}
        <figure>
          <img src={profile.profImg ? profile.profImg['thumb190x190'] : ''} alt={profile.nickNm} />
        </figure>
        <span>
          {profile.grade} / Lv.{profile.level}
        </span>
      </ProfileImg>

      <ContentWrap>
        {urlrStr == 'profile' && (
          <LevelWrap>
            <LevelText>LEVEL {profile.level}</LevelText>
            <LevelStatusBarWrap>
              <LevelStatus style={{width: `calc(${expCalc}% + 20px)`}}>{`${expCalc}%`}</LevelStatus>
            </LevelStatusBarWrap>
          </LevelWrap>
        )}

        <NameWrap>
          <strong>{profile.nickNm}</strong>
          <span>{`@${profile.memId}`}</span>
        </NameWrap>

        <ProfileMsg>{profile.profMsg}</ProfileMsg>
        <CountingWrap>
          <span onClick={() => fanContext()}>
            팬 <em>{profile.fanCnt}</em>
          </span>
          <span onClick={() => starContext()}>
            스타 <em>{profile.starCnt}</em>
          </span>
          {urlrStr !== myProfileNo && urlrStr !== 'profile' && (
            <div onClick={() => context.action.updateMypageReport(true)}></div>
          )}
        </CountingWrap>
        <ButtonWrap>
          {/* <InfoConfigBtn>
            <a href="/private">내 정보 관리</a>
          </InfoConfigBtn> */}

          {createFanList()}
        </ButtonWrap>
      </ContentWrap>
      {context.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
      {context.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
      {context.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
      {context.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
      {/* {context.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />} */}
    </MyProfile>
  )
}

export default myProfile
//styled======================================
const MyProfile = styled.div`
  display: flex;
  flex-direction: row;

  width: 100%;
  min-height: 300px;
  margin: 0 auto;
  padding: 40px 16px 57px 16px;

  & > div {
    flex: 0 0 auto;
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    flex-direction: column;
    padding: 10px 0 16px 0;
    padding-top: ${props => (props.webview && props.webview === 'new' ? '48px' : '')};
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
    order: 2;
  }
  & .liveIcon {
    position: absolute;
    right: 0;
    top: 0px;
    width: 52px;
    height: 26px;
    background: url(${LiveIcon}) no-repeat center center / cover;
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
  max-width: calc(100% + 2px);
  border-radius: 10px;
  background-color: ${COLOR_MAIN};
  text-align: right;
  color: #fff;
  font-size: 9px;
  padding: 1px 0;
  padding-right: 6px;
  line-height: 15px;
  box-sizing: border-box;
  text-indent: 3px;
  @media (max-width: ${WIDTH_TABLET_S}) {
    line-height: 13px;
  }
`
//닉네임
const NameWrap = styled.div`
  margin-top: 10px;
  & > * {
    display: inline-block;
  }
  strong {
    color: #000;
    font-size: 24px;
    line-height: 32px;
    font-weight: 800;
  }
  span {
    padding-left: 5px;
    color: #424242;
    font-size: 14px;
    line-height: 20px;
    vertical-align: middle;
    transform: skew(-0.03deg);
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    display: block !important;
    text-align: center;
    & > * {
      display: block;
    }
    span {
      padding: 2px 0 0 0;
      transform: skew(-0.03deg);
    }
  }
`
//팬, 스타 수
const CountingWrap = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  span {
    display: inline-block;
    font-size: 20px;
    letter-spacing: -0.35px;
    color: ${COLOR_MAIN};
    transform: skew(-0.03deg);
    font-weight: 600;
    em {
      display: inline-block;
      padding-left: 1px;
      color: #000;
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
  & div {
    width: 36px;
    height: 36px;
    background: url(${IMG_SERVER}/images/api/ic_report.png);
    margin-left: 18px;
    position: relative;
    cursor: pointer;
    :after {
      display: block;
      width: 1px;
      height: 12px;
      position: absolute;
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
      background: #e0e0e0;
      content: '';
    }
  }

  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 10px;
  }
`
//프로필메세지
const ProfileMsg = styled.p`
  margin-top: 8px;
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
    padding: 0 44px 0 17px;
    user-select: none;
    border: 1px solid #424242;
    border-radius: 18px;
    background: url(${IMG_SERVER}/images/api/my_btn_img.png) no-repeat 92% center;
    background-size: 32px 32px;
    font-size: 14px;
    font-weight: 600;
    line-height: 36px;
    letter-spacing: -0.5px;
    color: #424242;
    cursor: pointer;
  }

  a + a {
    margin-left: 4px;
  }
  .notBjWrap {
    display: flex;

    & button {
      display: flex;
      justify-content: center;
      width: 62px;
      height: 36px;
      color: #9e9e9e;
      font-size: 14px;
      transform: skew(-0.03deg);
      margin-right: 4px;
      border-radius: 18px;
      border: solid 1px #bdbdbd;
      &.fanRegist {
        border: solid 1px ${COLOR_MAIN};
        color: ${COLOR_MAIN};
      }
      & span {
        display: block;
        width: 18px;
        height: 18px;
        background: url(${IMG_SERVER}/images/api/ic_moon_s.png) no-repeat center center / cover;
      }
      & em {
        display: block;
        font-weight: normal;
        font-style: normal;
        line-height: 1.41;
        letter-spacing: -0.35px;
        height: 18px;
      }
    }
  }
`
//팬랭킹
const FanListWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > span {
    display: block;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: -0.35px;
    text-align: left;
    margin-right: 10px;
    color: #000000;
    transform: skew(-0.03deg);
  }
  & .moreFan {
    width: 36px;
    height: 36px;
    border: 1px solid #424242;
    border-radius: 50%;
    vertical-align: top;
    margin-top: -5px;
    span {
      display: inline-block;
      position: absolute;
      top: 16px;
      left: 16px;
      width: 2px;
      height: 2px;
      margin: 0 auto;
      background: #424242;
      border-radius: 50%;

      :after,
      :before {
        display: inline-block;
        position: absolute;
        width: 2px;
        height: 2px;
        border-radius: 50%;
        background: #424242;
        content: '';
      }
      :after {
        right: -5px;
      }
      :before {
        left: -5px;
      }
    }
  }
  @media (max-width: ${WIDTH_TABLET_S}) {
    margin-top: 10px;
  }
  > a {
    &.none {
      display: none;
    }
  }
`
const FanRank = styled.div`
  display: inline-block;
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 5px;
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
    border: 1px solid #424242;
  }

  :after {
    display: block;
    position: absolute;
    bottom: 0;
    right: -4px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-size: 12px 12px !important;
    content: '';
  }
  &.rank1:after {
    background: url(${IMG_SERVER}/images/api/ic_gold.png) no-repeat;
  }
  &.rank2:after {
    background: url(${IMG_SERVER}/images/api/ic_silver.png) no-repeat;
  }
  &.rank3:after {
    background: url(${IMG_SERVER}/images/api/ic_bronze.png) no-repeat;
  }
`
