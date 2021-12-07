import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Lottie from 'react-lottie'
import NoResult from 'components/ui/new_noResult'
// component
import {Context} from 'context'
import {IMG_SERVER} from 'context/config'

import PopupDetails from './popupDetails'
import PopupReport from './popupReport'

export default (props) => {
  const context = useContext(Context)
  const {tabContent, gganbuState, gganbuNo, gganbuInfo, myRankList, rankList} = props
  const [noticeTab, setNoticeTab] = useState('')
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
                      <span>{gganbuInfo.red_marble}</span>
                    </div>
                    <div className="list">
                      <img src="https://image.dalbitlive.com/event/gganbu/marble-2.png" />
                      <span>{gganbuInfo.yellow_marble}</span>
                    </div>
                    <div className="list">
                      <img src="https://image.dalbitlive.com/event/gganbu/marble-3.png" />
                      <span>{gganbuInfo.blue_marble}</span>
                    </div>
                    <div className="list">
                      <img src="https://image.dalbitlive.com/event/gganbu/marble-4.png" />
                      <span>{gganbuInfo.violet_marble}</span>
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
                      <span>{gganbuInfo.marble_pocket}</span>
                    </div>
                    <button onClick={() => history.push({pathname: `/event/gganbuPocket`})}>
                      <img src="https://image.dalbitlive.com/event/gganbu/btnPocket.png" alt="구슬 주머니" />
                    </button>
                  </div>
                </div>
                <div className="score">총 20,879점</div>
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
          <img src="https://image.dalbitlive.com/event/gganbu/wrapperTop.png" />
          <div className="rankList my">
            <div className="number">
              <span className="tit">내 순위</span>
              <span className="num">32</span>
            </div>
            <div className="rankBox">
              <div className="rankItem">
                <em className="badge">lv 65</em>
                <span className="userNick">해나잉뎅</span>
                <span className="userId">maiwcl88</span>
              </div>
              <div className="rankItem">
                <em className="badge">lv 65</em>
                <span className="userNick">해나잉뎅</span>
                <span className="userId">maiwcl88</span>
              </div>
            </div>
            <div className="score">
              <img src="https://image.dalbitlive.com/event/gganbu/iconScore.png" />
              <span>2,181</span>
            </div>
          </div>
          <div className="rankWrap">
            <div className="rankList">
              <div className="number medal-1">
                <img src="https://image.dalbitlive.com/event/gganbu/rankMedal-1.png" />
              </div>
              <div className="rankBox">
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
              </div>
              <div className="score">
                <img src="https://image.dalbitlive.com/event/gganbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
            <div className="rankList">
              <div className="number medal-2">
                <img src="https://image.dalbitlive.com/event/gganbu/rankMedal-2.png" />
              </div>
              <div className="rankBox">
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
              </div>
              <div className="score">
                <img src="https://image.dalbitlive.com/event/gganbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
            <div className="rankList">
              <div className="number medal-3">
                <img src="https://image.dalbitlive.com/event/gganbu/rankMedal-3.png" />
              </div>
              <div className="rankBox">
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
              </div>
              <div className="score">
                <img src="https://image.dalbitlive.com/event/gganbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
            <div className="rankList">
              <div className="number"></div>
              <div className="rankBox">
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
                <div className="rankItem">
                  <em className="badge">lv 65</em>
                  <span className="userNick">해나잉뎅</span>
                  <span className="userId">maiwcl88</span>
                </div>
              </div>
              <div className="score">
                <img src="https://image.dalbitlive.com/event/gganbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
            <NoResult type="default" text="아직 순위가 없습니다." />
          </div>
        </section>
      </div>
      {popupDetails && <PopupDetails setPopupDetails={setPopupDetails} />}
      {popupReport && <PopupReport setPopupReport={setPopupReport} gganbuNo={gganbuNo} />}
    </>
  )
}
