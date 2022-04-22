import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import styled, {css} from 'styled-components'
import Api from 'context/api'
import {Context} from 'context'
import Header from 'components/ui/new_header.js'
import Collect from './content/collect'
import Betting from './content/betting'
import PopupNotice from './content/popupNotice'
import PopupSearch from './content/popupSearch'
import PopupStatus from './content/popupStatus'

import './style.scss'
import './betting.scss'

export default () => {
  const globalCtx = useContext(Context)
  const history = useHistory()
  const tabMenuRef = useRef()
  const tabBtnRef = useRef()
  const [gganbuBadgeCnt, setGganbuBadgeCnt] = useState()
  const [gganbuNumber, setGganbuNumber] = useState()
  const [gganbuState, setGganbuState] = useState()
  const [gganbuInfo, setGganbuInfo] = useState()
  const [myRankList, setMyRankList] = useState()
  const [metchState, setMetchState] = useState(false)
  const [rankList, setRankList] = useState([])
  const [tabFixed, setTabFixed] = useState(false)
  const [tabContent, setTabContent] = useState('collect') // collect, betting
  const [popupNotice, setPopupNotice] = useState(false)
  const [popupSearch, setPopupSearch] = useState(false)
  const [popupStatus, setPopupStatus] = useState(false)

  const goBack = useCallback(() => history.goBack(), [])

  // 깐부회차 조회
  const gganbuRoundLookup = async () => {
    const {data, message} = await Api.gganbuMarbleGather()
    if (message === 'SUCCESS') {
      const {badgeCnt, gganbuState} = data
      setGganbuState(gganbuState)
      setGganbuBadgeCnt(badgeCnt)
      if (gganbuState === -1) {
        const {gganbuRoundInfo, rankList} = data
        setGganbuNumber(gganbuRoundInfo.gganbuNo)
        setRankList(rankList)
      } else if (gganbuState === 1) {
        const {gganbuRoundInfo, gganbuInfo, myRankInfo, rankList} = data
        setGganbuState(gganbuState)
        setGganbuNumber(gganbuRoundInfo.gganbuNo)
        setGganbuInfo(gganbuInfo)
        setMyRankList(myRankInfo)
        setRankList(rankList)
      }
    } else {
      console.log(message)
    }
  }
  // 깐부 현황 N배지
  const fetchGganbuBadge = async () => {
    const param = {
      gganbuNo: 1,
      memNo: globalCtx.profile.memNo,
      badgeSlct: 'p'
    }
    const {data, message} = await Api.getGganbuBadge(param)
    console.log(gganbuNumber, globalCtx.profile.memNo)
    if (message === 'SUCCESS') {
      console.log(message)
    } else {
      console.log(message)
    }
  }

  const tabScrollEvent = () => {
    const tabMenuNode = tabMenuRef.current
    const tabBtnNode = tabBtnRef.current
    if (tabMenuNode && tabBtnNode) {
      const tabMenuTop = tabMenuNode.offsetTop - tabBtnRef.current.clientHeight

      if (window.scrollY >= tabMenuTop) {
        setTabFixed(true)
      } else {
        setTabFixed(false)
      }
    }
  }

  useEffect(() => {
    if (gganbuInfo) {
      if (globalCtx.profile.memNo === gganbuInfo.mem_no) {
        setMetchState(true)
      } else {
        setMetchState(false)
      }
    }
  }, [gganbuRoundLookup, globalCtx.globalGganbuState])

  const GganbuMetch = () => {
    return (
      <>
        <div className="userList">
          <div
            className="photo"
            onClick={
              metchState
                ? () => history.push(`/mypage/${gganbuInfo.mem_no}`)
                : () => history.push(`/mypage/${gganbuInfo.ptr_mem_no}`)
            }>
            <img src={metchState ? gganbuInfo.mem_profile.thumb292x292 : gganbuInfo.ptr_mem_profile.thumb292x292} alt="유저이미지" />
          </div>
          <LevelBox className="badge" levelColor={metchState ? gganbuInfo.mem_level_color : gganbuInfo.ptr_mem_level_color}>
            Lv {metchState ? gganbuInfo.mem_level : gganbuInfo.ptr_mem_level}
          </LevelBox>
          <span className="nick">{metchState ? gganbuInfo.mem_nick : gganbuInfo.ptr_mem_nick}</span>
        </div>
        <div className="dot">
          <div className="var">
            <img src="https://image.dalbitlive.com/event/gganbu/dotGganbu.png" />
            <span className="varLevel">{gganbuInfo.average_level}</span>
            <span className="varTit">평균레벨</span>
          </div>
        </div>
        <div className="userList">
          <div
            className="photo"
            onClick={
              !metchState
                ? () => history.push(`/mypage/${gganbuInfo.mem_no}`)
                : () => history.push(`/mypage/${gganbuInfo.ptr_mem_no}`)
            }>
            <img src={!metchState ? gganbuInfo.mem_profile.thumb292x292 : gganbuInfo.ptr_mem_profile.thumb292x292} alt="유저이미지" />
          </div>
          <PtrLevelBox
            className="badge"
            memLevelColor={!metchState ? gganbuInfo.mem_level_color : gganbuInfo.ptr_mem_level_color}>
            Lv {!metchState ? gganbuInfo.mem_level : gganbuInfo.ptr_mem_level}
          </PtrLevelBox>
          <span className="nick">{!metchState ? gganbuInfo.mem_nick : gganbuInfo.ptr_mem_nick}</span>
        </div>
      </>
    )
  }

  const loginCheck = () => {
    if (!globalCtx.token.isLogin) {
      history.push({
        pathname: '/login',
        state: {
          state: '/'
        }
      })
    }
  }

  const notLoginAlert = () => {
    globalCtx.action.alert({
      msg: `깐부를 맺으면<br/>베팅소가 열립니다.`
    })
  }

  useEffect(() => {
    loginCheck()
    fetchGganbuBadge()
  }, [gganbuNumber])

  useEffect(() => {
    if (globalCtx.globalGganbuState > 0) gganbuRoundLookup()
  }, [globalCtx.globalGganbuState])

  useEffect(() => {
    window.addEventListener('scroll', tabScrollEvent)
    return () => window.removeEventListener('scroll', tabScrollEvent)
  }, [])

  useEffect(() => {
    if (tabContent === 'collect') {
      gganbuRoundLookup()
    }
    if (tabFixed) {
      window.scrollTo(0, tabMenuRef.current.offsetTop - tabBtnRef.current.clientHeight)
    }
  }, [tabContent])

  return (
    <div id="gganbu">
      <Header title="이벤트" />
      <div className="top">
        {gganbuNumber && gganbuNumber === '1' ? (
          <img src="https://image.dalbitlive.com/event/gganbu/gganbuTopImg-1.png" className="topImg" />
        ) : gganbuNumber && gganbuNumber === '2' ? (
          <img src="https://image.dalbitlive.com/event/gganbu/gganbuTopImg-2.png" className="topImg" />
        ) : gganbuNumber && gganbuNumber === '3' ? (
          <img src="https://image.dalbitlive.com/event/gganbu/gganbuTopImg-3.png" className="topImg" />
        ) : gganbuNumber && gganbuNumber === '4' ? (
          <img src="https://image.dalbitlive.com/event/gganbu/gganbuTopImg-4.png" className="topImg" />
        ) : (
          <></>
        )}
        <button className="topBtn" onClick={() => setPopupNotice(true)}>
          <img src="https://image.dalbitlive.com/event/gganbu/topBtn.png" alt="" />
        </button>
        <div className="memo">
          <div className="memoInner">
            <div className="userWrap">
              {globalCtx.profile && gganbuState === -1 ? (
                <>
                  <div className="userTxt"></div>
                  <div className="userUl">
                    <div className="userList">
                      <div className="photo" onClick={() => history.push(`/mypage/${globalCtx.profile.memNo}`)}>
                        <img src={globalCtx.profile.profImg.thumb292x292} alt="유저이미지" />
                      </div>
                      <LevelBox className="badge" levelColor={globalCtx.profile.levelColor}>
                        Lv {globalCtx.profile.level}
                      </LevelBox>
                      <span className="nick">{globalCtx.profile.nickNm}</span>
                    </div>
                    <div className="dot">
                      <img className="normal" src="https://image.dalbitlive.com/event/gganbu/dotNormal.png" />
                    </div>
                    <div className="userList">
                      <div className="photo" onClick={() => setPopupSearch(true)}>
                        <img src="https://image.dalbitlive.com/event/gganbu/gganbuUserNone.png" />
                      </div>
                      <button className="gganbuBtn" onClick={() => setPopupStatus(true)}>
                        <img src="https://image.dalbitlive.com/event/gganbu/gganbuStatusBtn.png" />
                        {gganbuBadgeCnt && gganbuBadgeCnt.s_reqCnt > 0 && (
                          <img className="btnNew" src="https://image.dalbitlive.com/event/gganbu/gganbuStatusBtnNew.png" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="userTxt">우리는 깐부잖나. 구슬을 같이 쓰는 친구 말이야.</div>
                  <div className="userUl">{gganbuInfo && <GganbuMetch />}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`tabWrap ${tabFixed === true ? 'fixed' : ''}`} ref={tabMenuRef}>
        <div className="tabBtn" ref={tabBtnRef}>
          <button
            className={globalCtx.gganbuTab === 'collect' ? 'active' : ''}
            onClick={() => globalCtx.action.updateGganbuTab('collect')}>
            <img
              src={`https://image.dalbitlive.com/event/gganbu/tabTxt-1-${globalCtx.gganbuTab === 'collect' ? 'on' : 'off'}.png`}
              alt="구슬 모으기"
            />
          </button>
          <button
            className={globalCtx.gganbuTab === 'betting' ? 'active' : ''}
            onClick={() => {
              gganbuState === 1 ? globalCtx.action.updateGganbuTab('betting') : notLoginAlert()
            }}>
            <img
              src={`https://image.dalbitlive.com/event/gganbu/tabTxt-2-${globalCtx.gganbuTab === 'betting' ? 'on' : 'off'}.png`}
              alt="구슬 베팅소"
            />
          </button>
          <span className="tabLine"></span>
        </div>
      </div>
      {globalCtx.gganbuTab === 'collect' ? (
        <Collect
          tabContent={globalCtx.gganbuTab}
          gganbuState={gganbuState}
          gganbuNumber={gganbuNumber}
          gganbuInfo={gganbuInfo}
          myRankList={myRankList}
          rankList={rankList}
        />
      ) : (
        <Betting tabContent={globalCtx.gganbuTab} gganbuNo={gganbuNumber} />
      )}

      {/* 팝업 */}
      {popupNotice && <PopupNotice setPopupNotice={setPopupNotice} />}
      {popupSearch && <PopupSearch setPopupSearch={setPopupSearch} gganbuNumber={gganbuNumber} />}
      {popupStatus && <PopupStatus setPopupStatus={setPopupStatus} gganbuNumber={gganbuNumber} />}
    </div>
  )
}

const LevelBox = styled.div`
  ${(props) => {
    const {levelColor} = props
    if (levelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${levelColor[0]}, ${levelColor[1]} 51%, ${levelColor[2]});
      `
    } else {
      return css`
        background-color: ${levelColor[0]};
      `
    }
  }};
  width: 44px;
  height: 16px;
  line-height: 16px;
  border-radius: 14px;
  font-weight: bold;
  font-size: 12px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.3px;
`
const PtrLevelBox = styled.div`
  ${(props) => {
    const {memLevelColor} = props
    if (memLevelColor.length === 3) {
      return css`
        background-image: linear-gradient(to right, ${memLevelColor[0]}, ${memLevelColor[1]} 51%, ${memLevelColor[2]});
      `
    } else {
      return css`
        background-color: ${memLevelColor[0]};
      `
    }
  }};
  width: 44px;
  height: 16px;
  line-height: 16px;
  border-radius: 14px;
  font-weight: bold;
  font-size: 12px;
  color: #fff;
  text-align: center;
  letter-spacing: -0.3px;
`
