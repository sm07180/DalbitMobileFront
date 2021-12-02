import React, {useEffect, useState, useRef, useCallback, useContext} from 'react'
import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import Lottie from 'react-lottie'
// component
import {IMG_SERVER} from 'context/config'

import PopupDetails from './popupDetails'
import PopupReport from './popupReport'
import {Context} from 'context'

export default (props) => {
  const context = useContext(Context)
  const {tabContent, setTabContent} = props
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
          <img src="https://image.dalbitlive.com/event/kanbu/kanbuBottomImg.png" className="bg" />
          <div className="title">
            <img src="https://image.dalbitlive.com/event/kanbu/bottomTitle.png" alt="구슬 현황" />
          </div>
          <button className="subTitle" onClick={() => setPopupDetails(true)}>
            <img src="https://image.dalbitlive.com/event/kanbu/bottomBtn.png" alt="구슬 얻는 법" />
          </button>
          <div className="status">
            <div className="statusWrap">
              <div className="marbleWrap">
                <div className="report">
                  <div className="list">
                    <img src="https://image.dalbitlive.com/event/kanbu/marble-1.png" />
                    <span>10</span>
                  </div>
                  <div className="list">
                    <img src="https://image.dalbitlive.com/event/kanbu/marble-2.png" />
                    <span>10</span>
                  </div>
                  <div className="list">
                    <img src="https://image.dalbitlive.com/event/kanbu/marble-3.png" />
                    <span>100</span>
                  </div>
                  <div className="list">
                    <img src="https://image.dalbitlive.com/event/kanbu/marble-4.png" />
                    <span>10</span>
                  </div>
                  <button onClick={() => setPopupReport(true)}>
                    <img src="https://image.dalbitlive.com/event/kanbu/btnReport.png" alt="구슬 리포트" />
                  </button>
                </div>
                <div className="pocket">
                  <div className="list">
                    {/* <img src="https://image.dalbitlive.com/event/kanbu/marblePocket-1.png" /> */}
                    <Lottie
                      options={{
                        loop: true,
                        autoPlay: true,
                        path: `${IMG_SERVER}/event/kanbu/marblePocket-1-lottie.json`
                      }}
                    />
                    <span>456</span>
                  </div>
                  <button>
                    <img src="https://image.dalbitlive.com/event/kanbu/btnPocket.png" alt="구슬 주머니" />
                  </button>
                </div>
              </div>
              <div className="score">총 20,879점</div>
            </div>
          </div>
          <div className="status">
            <div className="statusWrap">
              <div className="marbleWrapNone">
                깐부를 맺으면
                <br />
                구슬을 모을 수 있습니다.
              </div>
            </div>
          </div>
        </section>
        <section className={`notice ${noticeTab === 'active' ? 'active' : ''}`}>
          {noticeTab === 'active' ? (
            <>
              <img src="https://image.dalbitlive.com/event/kanbu/kanbuNoticeImg-on.png" />
              <button onClick={() => tabActive(noticeTab)}>
                <img src="https://image.dalbitlive.com/event/kanbu/tabArrow.png" />
              </button>
            </>
          ) : (
            <>
              <img src="https://image.dalbitlive.com/event/kanbu/kanbuNoticeImg-off.png" />
              <button onClick={() => tabActive(noticeTab)}>
                <img src="https://image.dalbitlive.com/event/kanbu/tabArrow.png" />
              </button>
            </>
          )}
        </section>
        <section className="rank">
          <img src="https://image.dalbitlive.com/event/kanbu/wrapperTop.png" />
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
              <img src="https://image.dalbitlive.com/event/kanbu/iconScore.png" />
              <span>2,181</span>
            </div>
          </div>
          <div className="rankWrap">
            <div className="rankList">
              <div className="number medal-1">
                <img src="https://image.dalbitlive.com/event/kanbu/rankMedal-1.png" />
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
                <img src="https://image.dalbitlive.com/event/kanbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
            <div className="rankList">
              <div className="number medal-2">
                <img src="https://image.dalbitlive.com/event/kanbu/rankMedal-2.png" />
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
                <img src="https://image.dalbitlive.com/event/kanbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
            <div className="rankList">
              <div className="number medal-3">
                <img src="https://image.dalbitlive.com/event/kanbu/rankMedal-3.png" />
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
                <img src="https://image.dalbitlive.com/event/kanbu/iconScore.png" />
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
                <img src="https://image.dalbitlive.com/event/kanbu/iconScore.png" />
                <span>2,181</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      {popupDetails && <PopupDetails setPopupDetails={setPopupDetails} />}
      {popupReport && <PopupReport setPopupReport={setPopupReport} />}
    </>
  )
}
