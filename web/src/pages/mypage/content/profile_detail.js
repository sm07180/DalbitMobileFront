import React, {useState, useEffect, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'
// context
import Api from 'context/api'
import {Context} from 'context'
//route
import {OS_TYPE} from 'context/config.js'
import Room, {RoomJoin} from 'context/room'
// utility
import Utility, {printNumber, addComma} from 'components/lib/utility'
import {Hybrid, isHybrid} from 'context/hybrid'
import Swiper from 'react-id-swiper'
//component
import ProfileReport from './profile_report'
import ProfileFanList from './profile_fanList'
import ProfilePresent from './profile_present'
import LayerPopupExp from './layer_popup_exp.js'

export default (props) => {
  console.log(props)
  //context & webview
  let history = useHistory()
  const context = useContext(Context)
  const {mypageReport, close, closeFanCnt, closeStarCnt, token} = context
  const {profile, location, webview} = props

  const urlrStr = location.pathname.split('/')[2]
  // state
  const [popup, setPopup] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [Zoom, setZoom] = useState(false)
  const [reportShow, SetShowReport] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  //pop
  const [popupExp, setPopupExp] = useState(false)
  const figureZoom = () => {
    setZoom(true)
  }
  //func 랭크팬리스트 생성
  const myProfileNo = context.profile.memNo
  const createFanList = () => {
    if (profile.fanRank == false) return null
    let result = []
    for (let index = 0; index < 3; index++) {
      if (profile.fanRank[index] == undefined) {
      } else {
        const {memNo, profImg, rank} = profile.fanRank[index]
        let link = ''
        if (memNo == myProfileNo) {
          link = `/menu/profile`
        } else {
          link = webview ? `/mypage/${memNo}?webview=${webview}` : `/mypage/${memNo}`
        }
        result = result.concat(
          <div
            style={{backgroundImage: `url(${profImg.thumb88x88})`}}
            className={`fanItem rank${rank}`}
            onClick={() => history.push(link)}
            key={index}></div>
        )
      }
    }
    result = result.concat(
      <button
        className="btn__fanMore"
        onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)}
        key="btn"
        style={{display: 'none'}}>
        <span></span>
      </button>
    )
    return (
      <>
        <div className="fanRankList">
          <button className="btn__fanRank" onClick={() => profile.fanRank.length > 0 && context.action.updateClose(true)}>
            팬랭킹
          </button>
          {result}
        </div>
      </>
    )
  }
  const goFanEdite = () => {
    history.push(`/mypage/${profile.memNo}/edit_fan`)
  }
  const goStarEdite = () => {
    history.push(`/mypage/${profile.memNo}/edit_star`)
  }
  //스와이퍼
  const swiperParams = {
    spaceBetween: 2,
    slidesPerView: 'auto',
    resistanceRatio: 0
  }
  //뱃지
  const BadgeSlide = profile.fanBadgeList.map((item, index) => {
    if (!profile.hasOwnProperty('fanBadgeList')) return null
    const {text, icon, startColor, endColor} = item
    //-----------------------------------------------------------------------
    return (
      <div className="badgeSlide" key={index}>
        <span
          className="fan-badge"
          style={{
            background: `linear-gradient(to right, ${startColor}, ${endColor}`
          }}>
          <img src={icon} alt={text} />
          <span>{text}</span>
        </span>
      </div>
    )
  })

  // expCalculate function
  let expCalc = Math.floor(((profile.exp - profile.expBegin) / (profile.expNext - profile.expBegin)) * 100)
  if (expCalc == 'Infinity') expCalc = 0
  let expPercent = ((profile.exp - profile.expBegin) / (profile.expNext - profile.expBegin)) * 100
  if (expPercent == 'Infinity') expCalc = 0
  // loading
  if (profile === null) {
    return <div style={{minHeight: '300px'}}></div>
  }

  return (
    <div className="profile-detail">
      <div className="profile-content">
        <div className="profile-image" url={profile.profImg ? profile.profImg['thumb190x190'] : ''}>
          <figure onClick={() => figureZoom()} style={{backgroundImage: `url(${profile.profImg.thumb190x190})`}}>
            <img src={profile.profImg ? profile.profImg['thumb190x190'] : ''} alt={profile.nickNm} />
            {/* {profile.level > 100 && <div className="profileBg" style={{backgroundImage: `url(${profile.profileBg})`}}></div>} */}
            {profile.level > 50 && <div className="holderBg" style={{backgroundImage: `url(${profile.holderBg})`}}></div>}
            <div className="holder" style={{backgroundImage: `url(${profile.holder})`}}></div>
          </figure>
          {Zoom === true && (
            <div className="zoom" onClick={() => setZoom(false)}>
              <img src={profile.profImg ? profile.profImg['url'] : ''} alt={profile.nickNm} className="zoomImg" />
            </div>
          )}
        </div>
        <div
          className={`title 
          ${expCalc < 10 ? `레벨 0 ~ 10` : ''}
          ${expCalc < 20 ? `레벨 10 ~ 20` : ''}
          ${expCalc < 30 ? `레벨 20 ~ 30` : ''}
          ${expCalc < 40 ? `레벨 30 ~ 40 ` : ''}
          ${expCalc < 50 ? `레벨 40 ~ 50` : ''}
        `}>
          Lv{profile.level} {profile.level !== 0 && `${profile.grade}`}
        </div>
        <div className="levelInfoWrap">
          {urlrStr == 'profile' && (
            <>
              <div className="levelBox">
                <div className="levelBar">
                  <span
                    className="expBarStatus"
                    style={{
                      width: `${expCalc < 20 ? `calc(${expCalc}% + 20px)` : `${expCalc}%`}`
                    }}></span>
                  <span className="expTitle expTitle--start">0</span>
                  <span className="expTitle expTitle--end">{profile.expNext - profile.expBegin}</span>
                </div>

                <div className="levelInfo">
                  <button className="btn-info" onClick={() => setPopupExp(popup ? false : true)}>
                    <span className="blind">경험치</span>
                  </button>
                  EXP
                  <span className="expTitle">{Math.floor(((profile.expNext - profile.expBegin) * expPercent) / 100)}</span>
                  <span className="expTitle expTitle--rate">{profile.expRate}%</span>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="nameWrap">
          <strong>
            {profile.nickNm}
            <span className="subIconWrap">
              {/* {<span className="nationIcon"></span>} */}
              {profile.gender === 'f' && <span className="femaleIcon"></span>}
              {profile.gender === 'm' && <span className="maleIcon"></span>}
            </span>
          </strong>
        </div>
        {profile.isSpecial === true && <span className="specialIcon">스페셜 DJ</span>}
        {/* <ProfileMsg dangerouslySetInnerHTML={{__html: profile.profMsg.split('\n').join('<br />')}}></ProfileMsg> */}
        {profile.profMsg && <div className="profileMsgWrap">{profile.profMsg}</div>}
        {profile.fanBadgeList && profile.fanBadgeList.length > 0 ? (
          <div className="badgeWrap">
            <Swiper {...swiperParams}>{BadgeSlide}</Swiper>
          </div>
        ) : (
          // <div className="topMedal">TOP 랭킹에 도전해보세요</div>
          <></>
        )}
        {profile.fanRank.length !== 0 && <div className="fanListWrap">{createFanList()}</div>}
        <div className="categoryCntWrap">
          {profile.fanCnt > 0 ? (
            <div className="count-box" onClick={goFanEdite}>
              <span className="icoWrap">
                <span className="icoImg type1"></span>
                <em className="icotitle icotitle--active">팬</em>
              </span>
              <em className="cntTitle">
                {profile.fanCnt > 9999 ? Utility.printNumber(profile.fanCnt) : Utility.addComma(profile.fanCnt)}
              </em>
            </div>
          ) : (
            <div className="count-box">
              <span className="icoWrap">
                <span className="icoImg type1"></span>
                <em className="icotitle">팬</em>
              </span>
              <em className="cntTitle">
                {profile.fanCnt > 9999 ? Utility.printNumber(profile.fanCnt) : Utility.addComma(profile.fanCnt)}
              </em>
            </div>
          )}

          {profile.starCnt > 0 ? (
            <div className="count-box" onClick={goStarEdite}>
              <span className="icoWrap">
                <span className="icoImg type2"></span>
                <em className="icotitle icotitle--active">스타</em>
              </span>
              <em className="cntTitle">
                {profile.starCnt > 9999 ? Utility.printNumber(profile.starCnt) : Utility.addComma(profile.starCnt)}
              </em>
            </div>
          ) : (
            <div className="count-box">
              <span className="icoWrap">
                <span className="icoImg type2"></span>
                <em className="icotitle">스타</em>
              </span>
              <em className="cntTitle">
                {profile.starCnt > 9999 ? Utility.printNumber(profile.starCnt) : Utility.addComma(profile.starCnt)}
              </em>
            </div>
          )}

          <div className="count-box">
            <span className="icoWrap">
              <span className="icoImg"></span>
              <em className="icotitle">좋아요</em>
            </span>
            <em className="cntTitle">
              {profile.likeTotCnt > 9999 ? Utility.printNumber(profile.likeTotCnt) : Utility.addComma(profile.likeTotCnt)}
            </em>
          </div>
        </div>

        <div className="buttonWrap">
          <div className="buttonWrapInner">
            {urlrStr !== context.token.memNo && (
              <div className="notBjWrap">
                {context.customHeader['os'] === OS_TYPE['IOS'] ? (
                  <></>
                ) : (
                  <button
                    onClick={() => {
                      context.action.updateClosePresent(true)
                    }}
                    className="giftbutton">
                    {/* <span></span> */}
                    <em>선물하기</em>
                  </button>
                )}
                {profile.isFan === 0 && (
                  <button className="fanRegist" onClick={() => Cancel(myProfileNo)}>
                    팬
                  </button>
                )}
                {profile.isFan === 1 && (
                  <button onClick={() => fanRegist(myProfileNo)}>
                    <em>팬</em> <em className="plus"></em>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {context.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
      {context.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
      {context.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
      {context.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
      {context.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />}
      {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
    </div>
  )
}
