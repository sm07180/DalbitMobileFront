import React, {useState, useEffect, useContext, useRef} from 'react'
import {useHistory} from 'react-router-dom'
// context
import Api from 'context/api'
import {Context} from 'context'
//route
import {OS_TYPE} from 'context/config.js'
import qs from 'query-string'
import Room, {RoomJoin} from 'context/room'
// utility
import Utility, {printNumber, addComma} from 'components/lib/utility'
import {Hybrid, isHybrid} from 'context/hybrid'
import LiveIcon from '../component/ic_live.svg'
import Swiper from 'react-id-swiper'
//component
import ProfileReport from './profile_report'
import ProfileFanList from './profile_fanList'
import ProfilePresent from './profile_present'
import ProfileRank from './profile_rank'
import ProfileFanRank from './profile_fanRank'
import LayerPopupExp from './layer_popup_exp.js'
import AdminIcon from '../../menu/static/ic_home_admin.svg'
import EditIcon from '../static/edit_g_l.svg'

export default (props) => {
  //context & webview
  let history = useHistory()
  const context = useContext(Context)
  const {mypageReport, close, closeFanCnt, closeStarCnt, token} = context
  const {profile, location, webview, locHash} = props

  const urlrStr = location.pathname.split('/')[2]
  // state
  const [popup, setPopup] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [Zoom, setZoom] = useState(false)
  const [reportShow, setReportShow] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showPresent, setShowPresent] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [rankTabType, setRankTabType] = useState('tabRank') //tabRank, tabgood

  //pop
  const [popupExp, setPopupExp] = useState(false)
  const figureZoom = () => {
    setZoom(true)
  }
  // 로그인한 user memNo
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
          if (webview) {
            link = `/mypage/${memNo}?webview=${webview}`
          } else {
            link = `/menu/profile`
          }
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
          {myProfileNo === profile.memNo ? (
            <button
              className="btn__fanRank"
              onClick={() => {
                context.action.updateCloseRank(true)
                setRankTabType('tabRank')
              }}>
              팬랭킹
            </button>
          ) : (
            <button
              className="btn__fanRank"
              onClick={() => {
                profile.fanRank.length > 0 && context.action.updateCloseFanRank(true)
                setRankTabType('tabRank')
              }}>
              팬랭킹
            </button>
          )}

          {result}
        </div>
      </>
    )
  }
  const viewLayer = (type) => {
    if (type === 'fan') {
      if (showEdit === true) {
        editFan()
      } else {
        viewFanList()
      }
    } else if (type === 'star') {
      if (showEdit === true) {
        editStar()
      } else {
        viewStarList()
      }
    } else if (type === 'like') {
      viewGoodList()
    }
  }
  const createCountList = (type, count) => {
    let text, ico
    if (type === 'fan') {
      text = '팬'
      ico = 'type1'
    } else if (type === 'star') {
      text = '스타'
      ico = 'type2'
    } else if (type === 'like') {
      text = '좋아요'
    }
    return (
      <>
        {type !== 'like' && count > 0 ? (
          <div className="count-box" onClick={() => viewLayer(type)}>
            <span className="icoWrap">
              <span className={`icoImg ${ico}`}></span>
              <em className={`icotitle ${showEdit ? 'icotitle--active' : ''}`}>{text}</em>
            </span>
            <em className="cntTitle">{count > 9999 ? Utility.printNumber(count) : Utility.addComma(count)}</em>
          </div>
        ) : (
          <div className="count-box" onClick={() => viewLayer(type)}>
            <span className="icoWrap">
              <span className={`icoImg ${ico}`}></span>
              <em className="icotitle">{text}</em>
            </span>
            <em className="cntTitle">{count > 9999 ? Utility.printNumber(count) : Utility.addComma(count)}</em>
          </div>
        )}
      </>
    )
  }
  const editFan = () => {
    history.push(`/mypage/${profile.memNo}/edit_fan`)
  }
  const editStar = () => {
    history.push(`/mypage/${profile.memNo}/edit_star`)
  }

  //팬등록
  async function fetchDataFanRegist(myProfileNo) {
    const res = await Api.fan_change({
      data: {
        memNo: urlrStr
      }
    })
    if (res.result === 'success') {
      context.action.alert({
        callback: () => {
          context.action.updateMypageFanCnt(myProfileNo)
        },
        msg: '팬등록에 성공하였습니다.'
      })
    } else if (res.result === 'fail') {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }
  //function:팬해제
  const Cancel = (myProfileNo) => {
    async function fetchDataFanCancel(myProfileNo) {
      const res = await Api.mypage_fan_cancel({
        data: {
          memNo: urlrStr
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
  const fanRegist = (myProfileNo) => {
    fetchDataFanRegist(myProfileNo)
  }
  //func star count
  const viewStarList = () => {
    if (profile.starCnt > 0) {
      context.action.updateCloseStarCnt(true)
    }
  }
  //func fuan count
  const viewFanList = () => {
    if (profile.fanCnt > 0) {
      context.action.updateCloseFanCnt(true)
    }
  }
  //func Good count
  const viewGoodList = () => {
    if (myProfileNo !== profile.memNo) {
      context.action.updateCloseFanRank(true)
      setRankTabType('tabGood')
    } else {
      if (profile.likeTotCnt > 0) {
        context.action.updateCloseRank(true)
        setRankTabType('tabGood')
      }
    }
  }

  //스와이퍼
  const swiperParams = {
    spaceBetween: 2,
    slidesPerView: 'auto',
    resistanceRatio: 0
  }
  //뱃지
  const BadgeSlide = profile.liveBadgeList.concat(profile.fanBadgeList).map((item, index) => {
    if (!profile.hasOwnProperty('liveBadgeList') && !profile.hasOwnProperty('fanBadgeList')) return null
    const {text, icon, startColor, endColor} = item
    console.log(item)
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

  //팝업실행
  const popStateEvent = (e) => {
    if (e.state === null) {
      setPopup(false)
      context.action.updateMypageReport(false)
      context.action.updateClose(false)
      context.action.updateCloseFanCnt(false)
      context.action.updateCloseStarCnt(false)
      context.action.updateCloseGoodCnt(false)
    } else if (e.state === 'layer') {
      setPopup(true)
    }
  }
  // expCalculate function
  let expCalc = Math.floor(((profile.exp - profile.expBegin) / (profile.expNext - profile.expBegin)) * 100)
  if (expCalc == 'Infinity') expCalc = 0
  let expPercent = ((profile.exp - profile.expBegin) / (profile.expNext - profile.expBegin)) * 100
  if (expPercent == 'Infinity') expCalc = 0
  // loading
  if (profile === null) {
    return <div style={{minHeight: '230px'}}></div>
  }

  const goBack = () => {
    const {webview} = qs.parse(location.search)
    if (webview && webview === 'new' && isHybrid()) {
      sessionStorage.removeItem('webview')
      Hybrid('CloseLayerPopup')
    } else {
      if (locHash instanceof Object && locHash.state) {
        locHash.state.hash === '#layer' ? history.go(-2) : history.goBack()
      } else {
        history.goBack()
      }
    }
  }
  //function모바일 레어어 실행
  useEffect(() => {
    if (popup) {
      if (window.location.hash === '') {
        window.history.pushState('layer', '', '/#layer')
        setScrollY(window.scrollY)
      }
    } else if (!popup) {
      if (window.location.hash === '#layer') {
        // window.history.back()
        history.goBack()
        setTimeout(() => window.scrollTo(0, scrollY))
      }
    }
  }, [popup])
  useEffect(() => {
    window.addEventListener('popstate', popStateEvent)
    return () => {
      window.removeEventListener('popstate', popStateEvent)
    }
  }, [])
  useEffect(() => {
    if (mypageReport || close || closeFanCnt || closeStarCnt) {
      setPopup(true)
    } else {
      setPopup(false)
    }
  }, [mypageReport, close, closeFanCnt, closeStarCnt])
  useEffect(() => {
    if (myProfileNo === profile.memNo) {
      if (context.adminChecker === true) {
        setShowAdmin(true)
      }
      setShowPresent(false)
      setShowEdit(true)
    } else {
      setShowPresent(true)
      setShowEdit(false)
      setShowAdmin(false)
    }
  }, [profile.memNo])

  return (
    <div className="profile-detail">
      <div className="adminEditButton">
        {profile.memNo == myProfileNo && (
          <button
            onClick={() => {
              history.push(`/private`)
            }}>
            <img src={EditIcon} alt="마이프로필 수정하기" />
          </button>
        )}

        {token && token.isLogin && showAdmin && (
          <a href="/admin/clip">
            <img src={AdminIcon} alt="관리자아이콘" />
          </a>
        )}
      </div>

      <button className="closeBtn" onClick={goBack}>
        <span className="blind">프로필 닫기</span>
      </button>
      <div className="profile-content">
        {myProfileNo !== profile.memNo && (
          <>
            <div onClick={() => context.action.updateMypageReport(true)} className="reportIcon">
              <span className="blind">신고하기</span>
            </div>
          </>
        )}
        {profile.roomNo !== '' && (
          <button
            className="liveIcon"
            onClick={() => {
              if (webview === 'new') {
                if (
                  context.customHeader['os'] === OS_TYPE['Android'] ||
                  (context.customHeader['os'] === OS_TYPE['IOS'] && context.customHeader['appBuild'] >= 178)
                ) {
                  return RoomJoin({roomNo: profile.roomNo})
                }
              }

              if (webview === 'new' && Utility.getCookie('listen_room_no')) {
                return false
              }

              if (webview === 'new' && Utility.getCookie('clip-player-info') && context.customHeader['os'] === OS_TYPE['IOS']) {
                return context.action.alert({msg: `클립 종료 후 청취 가능합니다.\n다시 시도해주세요.`})
              } else {
                if (webview === 'new' && Utility.getCookie('listen_room_no') && context.customHeader['os'] === OS_TYPE['IOS']) {
                  return false
                } else {
                  RoomJoin({roomNo: profile.roomNo})
                }
              }
            }}>
            <img src={LiveIcon} className="ico-live" />
            <span>Live</span>
          </button>
        )}
        <div className="profile-image">
          <figure onClick={() => figureZoom()} style={{backgroundImage: `url(${profile.profImg.url})`}}>
            <img src={profile.profImg ? profile.profImg['url'] : ''} alt={profile.nickNm} />
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
        <div className="title">
          Lv{profile.level} {profile.level !== 0 && `${profile.grade}`}
        </div>
        {urlrStr == 'profile' && (
          <div className="levelInfoWrap">
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
          </div>
        )}
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
        {/* {profile.isSpecial === true && <span className="specialIcon">스페셜 DJ</span>} */}
        {profile.isSpecial === true ? (
          <span className="specialIcon">스페셜 DJ</span>
        ) : profile.isNew === true ? (
          <span className="newIcon">신입 DJ</span>
        ) : profile.isNewListener === true ? (
          <span className="newIcon">신입청취자</span>
        ) : (
          <span className="blind">no badge</span>
        )}
        {/* <ProfileMsg dangerouslySetInnerHTML={{__html: profile.profMsg.split('\n').join('<br />')}}></ProfileMsg> */}
        {profile.profMsg && <div className="profileMsgWrap">{profile.profMsg}</div>}
        {profile.liveBadgeList && profile.liveBadgeList.length > 0 && (
          <div className="badgeWrap">
            <Swiper {...swiperParams}>{BadgeSlide}</Swiper>
          </div>
        )}
        {profile.fanRank.length > 0 && <div className="fanListWrap">{createFanList()}</div>}

        {profile.likeTotCnt > 0 && (
          <div className="fanListWrap">
            {myProfileNo === profile.memNo ? (
              <button
                className="btn__fanRank cupid"
                onClick={() => {
                  {
                    profile.likeTotCnt > 0 && context.action.updateCloseRank(true)
                    setRankTabType('tabGood')
                  }
                }}>
                왕큐피트
              </button>
            ) : (
              <button
                className="btn__fanRank cupid"
                onClick={() => {
                  profile.likeTotCnt > 0 && context.action.updateCloseFanRank(true)
                  setRankTabType('tabGood')
                }}>
                왕큐피트
              </button>
            )}

            <p
              className="fanListWrap__cupidNick"
              onClick={() => {
                history.push(`/mypage/${profile.cupidMemNo}`)
              }}>
              {profile.cupidNickNm}
            </p>
          </div>
        )}

        <div className="categoryCntWrap">
          {createCountList('fan', profile.fanCnt)}
          {createCountList('star', profile.starCnt)}
          {createCountList('like', profile.likeTotCnt)}
        </div>

        {/* 선물하기 */}
        {showPresent ? (
          <div className="buttonWrap">
            <div className="buttonWrapInner">
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
                {profile.isFan === true && (
                  <button className="fanRegist" onClick={() => Cancel(myProfileNo)}>
                    팬
                  </button>
                )}
                {profile.isFan === false && (
                  <button className="isNotFan" onClick={() => fanRegist(myProfileNo)}>
                    팬
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
      {context.mypageReport === true && <ProfileReport {...props} reportShow={reportShow} />}
      {context.close === true && <ProfileFanList {...props} reportShow={reportShow} name="팬 랭킹" />}
      {context.closeFanCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="팬" />}
      {context.closeStarCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="스타" />}
      {context.closeGoodCnt === true && <ProfileFanList {...props} reportShow={reportShow} name="좋아요" />}
      {context.closePresent === true && <ProfilePresent {...props} reportShow={reportShow} name="선물" />}
      {context.closeRank === true && <ProfileRank {...props} type={rankTabType} name="랭킹" />}
      {context.closeFanRank === true && <ProfileFanRank {...props} type={rankTabType} name="뉴팬랭킹" />}
      {popupExp && <LayerPopupExp setPopupExp={setPopupExp} />}
    </div>
  )
}
