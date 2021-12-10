import React, {useEffect, useState, useCallback, useLayoutEffect} from 'react'
import {useHistory} from 'react-router-dom'
import Utility, {isHitBottom, addComma} from 'components/lib/utility'
import styled, {css} from 'styled-components'
import Api from 'context/api'
import Lottie from 'react-lottie'
import NoResult from 'components/ui/new_noResult'
// component
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import PopupDetails from './popupDetails'
import PopupReport from './popupReport'

export default (props) => {
  const {tabContent, gganbuState, gganbuNo, gganbuInfo, myRankList} = props // rankList
  const [noticeTab, setNoticeTab] = useState('')
  const [rankList, setRankList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [popupDetails, setPopupDetails] = useState(false)
  const [popupReport, setPopupReport] = useState(false)

  const history = useHistory()

  const tabActive = () => {
    if (noticeTab === 'active') {
      setNoticeTab('')
    } else {
      setNoticeTab('active')
    }
  }

  let totalPage = 1
  let pagePerCnt = 10
  // 깐부 랭킹 리스트
  const gganbuRankList = useCallback(async () => {
    const param = {
      gganbuNo: gganbuNo,
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    const {data, message} = await Api.getGganbuRankList(param)
    if (message === 'SUCCESS') {
      totalPage = Math.ceil(data.listCnt / pagePerCnt)
      console.log('totalPage', totalPage)
      if (currentPage > 1) {
        setRankList(rankList.concat(data.list))
      } else {
        setRankList(data.list)
      }
    } else {
      console.log(message)
    }
  }, [currentPage])

  const scrollEvtHdr = () => {
    if (Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1)
      console.log('bottom hit!', currentPage)
    }
  }

  useLayoutEffect(() => {
    if (currentPage === 0) setCurrentPage(1)
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
      console.log('hit!!!', currentPage)
    }
  }, [currentPage])

  useEffect(() => {
    if (gganbuNo !== undefined) {
      gganbuRankList()
    }
  }, [gganbuNo])

  return (
    <>
      <div id="collect" style={{display: `${tabContent === 'collect' ? 'block' : 'none'}`}}>
        <section className="content">
          <img src="https://image.dalbitlive.com/event/gganbu/gganbuBottomImg.png" className="bg" />
          <div className="title">
            <img src="https://image.dalbitlive.com/event/gganbu/bottomTitle.png" alt="구슬 현황" />
          </div>
          <button className="subTitle" onClick={() => setPopupDetails(true)}>
            <img src="https://image.dalbitlive.com/event/gganbu/bottomBtn.png" alt="구슬 얻는 법" />
          </button>
          {gganbuState === -1 ? (
            <div className="status">
              <div className="statusWrap">
                <div className="marbleWrapNone">
                  깐부를 맺으면
                  <br />
                  구슬을 모을 수 있습니다.
                </div>
              </div>
            </div>
          ) : (
            <div className="status">
              <div className="statusWrap">
                <div className="marbleWrap">
                  <div className="report">
                    <div className="list">
                      <img src="https://image.dalbitlive.com/event/gganbu/marble-1.png" />
                      <span>{gganbuInfo && gganbuInfo.red_marble}</span>
                    </div>
                    <div className="list">
                      <img src="https://image.dalbitlive.com/event/gganbu/marble-2.png" />
                      <span>{gganbuInfo && gganbuInfo.yellow_marble}</span>
                    </div>
                    <div className="list">
                      <img src="https://image.dalbitlive.com/event/gganbu/marble-3.png" />
                      <span>{gganbuInfo && gganbuInfo.blue_marble}</span>
                    </div>
                    <div className="list">
                      <img src="https://image.dalbitlive.com/event/gganbu/marble-4.png" />
                      <span>{gganbuInfo && gganbuInfo.violet_marble}</span>
                    </div>
                    <button onClick={() => setPopupReport(true)}>
                      <img src="https://image.dalbitlive.com/event/gganbu/btnReport.png" alt="구슬 리포트" />
                    </button>
                  </div>
                  <div className="pocket">
                    <div className="list">
                      {/* <img src="https://image.dalbitlive.com/event/gganbu/marblePocket-1.png" /> */}
                      <Lottie
                        options={{
                          loop: true,
                          autoPlay: true,
                          path: `${IMG_SERVER}/event/gganbu/marblePocket-1-lottie.json`
                        }}
                      />
                      <span>{gganbuInfo && gganbuInfo.marble_pocket}</span>
                    </div>
                    <button onClick={() => history.push({pathname: `/event/gganbuPocket`})}>
                      <img src="https://image.dalbitlive.com/event/gganbu/btnPocket.png" alt="구슬 주머니" />
                    </button>
                  </div>
                </div>
                <div className="score">총 {Utility.addComma(gganbuInfo && gganbuInfo.marble_pocket_pt)}점</div>
              </div>
            </div>
          )}
        </section>
        <section className={`notice ${noticeTab === 'active' ? 'active' : ''}`}>
          {noticeTab === 'active' ? (
            <>
              <img src="https://image.dalbitlive.com/event/gganbu/gganbuNoticeImg-on.png" />
              <button onClick={() => tabActive(noticeTab)}>
                <img src="https://image.dalbitlive.com/event/gganbu/tabArrow.png" />
              </button>
            </>
          ) : (
            <>
              <img src="https://image.dalbitlive.com/event/gganbu/gganbuNoticeImg-off.png" />
              <button onClick={() => tabActive(noticeTab)}>
                <img src="https://image.dalbitlive.com/event/gganbu/tabArrow.png" />
              </button>
            </>
          )}
        </section>
        <section className="rank">
          <img className="rankTopImg" src="https://image.dalbitlive.com/event/gganbu/wrapperTop.png" />
          {myRankList && gganbuState === 1 && (
            <div className="rankList my">
              <div className="number">
                <span className="tit">내 순위</span>
                <span className="num">32</span>
              </div>
              <div className="rankBox">
                <div className="rankItem">
                  <PtrLevelBox className="badge" levelColor={myRankList.ptr_mem_level_color}>
                    lv {myRankList.ptr_mem_level}
                  </PtrLevelBox>
                  <span className="userNick">{myRankList.ptr_mem_nick}</span>
                  <span className="userId">{myRankList.ptr_mem_id}</span>
                </div>
                <div className="rankItem">
                  <LevelBox className="badge" levelColor={myRankList.mem_level_color}>
                    lv {myRankList.mem_level}
                  </LevelBox>
                  <span className="userNick">{myRankList.mem_nick}</span>
                  <span className="userId">{myRankList.mem_id}</span>
                </div>
              </div>
              <div className="score">
                <img src="https://image.dalbitlive.com/event/gganbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
          )}
          <div className="rankWrap">
            {rankList ? (
              <>
                {rankList.map((data, index) => {
                  const {
                    ptr_mem_level,
                    ptr_mem_level_color,
                    ptr_mem_nick,
                    ptr_mem_id,
                    ptr_mem_stat,
                    mem_level,
                    mem_level_color,
                    mem_nick,
                    mem_id,
                    mem_state
                  } = data
                  return (
                    <div className="rankList" key={index}>
                      {index < 3 ? (
                        <div className={`number medal-${index + 1}`}>
                          <img src={`https://image.dalbitlive.com/event/gganbu/rankMedal-${index + 1}.png`} />
                        </div>
                      ) : (
                        <div className="number">{index + 1}</div>
                      )}
                      <div className="rankBox">
                        <div className="rankItem">
                          {ptr_mem_stat === 1 ? (
                            <>
                              <PtrLevelBox className="badge" levelColor={ptr_mem_level_color}>
                                lv {ptr_mem_level}
                              </PtrLevelBox>
                              <span className="userNick">{ptr_mem_nick}</span>
                              <span className="userId">{ptr_mem_id}</span>
                            </>
                          ) : ptr_mem_stat === 4 ? (
                            <>
                              <div className="badge" style={{backgroundColor: '#6B6B6B'}}>
                                lv {ptr_mem_level}
                              </div>
                              <span className="userNick">깍두기</span>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="rankItem">
                          {mem_state === 1 ? (
                            <>
                              <LevelBox className="badge" levelColor={mem_level_color}>
                                lv {mem_level}
                              </LevelBox>
                              <span className="userNick">{mem_nick}</span>
                              <span className="userId">{mem_id}</span>
                            </>
                          ) : mem_state === 4 ? (
                            <>
                              <div className="badge" style={{backgroundColor: '#6B6B6B'}}>
                                lv {ptr_mem_level}
                              </div>
                              <span className="userNick">깍두기</span>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            ) : (
              <NoResult type="default" text="아직 순위가 없습니다." />
            )}
          </div>
        </section>
      </div>
      {popupDetails && <PopupDetails setPopupDetails={setPopupDetails} />}
      {popupReport && <PopupReport setPopupReport={setPopupReport} gganbuNo={gganbuNo} />}
    </>
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
