import React, {useState, useEffect} from 'react'
//context
import Api from 'context/api'

import './search.scss'

export default (props) => {
  const {setPopupReport, gganbuNo} = props

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const closePopup = () => {
    setPopupReport()
  }
  const wrapClick = (e) => {
    const target = e.target
    if (target.id === 'popupWrap') {
      closePopup()
    }
  }

  // 깐부 리포트 리스트 조회
  const postGganbuReport = async () => {
    const {data, message} = await Api.postGganbuReport({
      gganbuNo: gganbuNo,
      pageNo: 1,
      pagePerCnt: 50
    })
    if (message === 'SUCCESS') {
      console.log(1)
    } else {
      console.log(message)
    }
  }

  useEffect(() => {
    postGganbuReport()
  }, [])

  return (
    <div id="popupWrap" onClick={wrapClick}>
      <div className="contentWrap">
        <h1 className="title">구슬 리포트</h1>
        <div className="searchTitle">
          나의 팬<span>낮은 레벨 순</span>
        </div>
        <div className="listWrap">
          <div className="list">
            <div className="photo">
              <img src="" alt="유저이미지" />
            </div>
            <div className="listBox">
              <div className="nick">finish</div>
              <div className="listItem">
                <span>Lv. 38</span>
                <span className="average">
                  <em>평균</em>
                  <span>Lv 20</span>
                </span>
              </div>
            </div>
            <button className="submit">신청</button>
          </div>
          <div className="list">
            <div className="photo">
              <img src="" alt="유저이미지" />
            </div>
            <div className="listBox">
              <div className="nick">finish</div>
              <div className="listItem">
                <span>Lv. 38</span>
                <span className="average">
                  <em>평균</em>
                  <span>Lv 20</span>
                </span>
              </div>
            </div>
            <button className="cancel">취소</button>
          </div>
          <div className="list">
            <div className="photo">
              <img src="" alt="유저이미지" />
            </div>
            <div className="listBox">
              <div className="nick">finish</div>
              <div className="listItem">
                <span>Lv. 38</span>
                <span className="average">
                  <em>평균</em>
                  <span>Lv 20</span>
                </span>
              </div>
            </div>
            <button className="accept">수락</button>
          </div>
          <div className="list">
            <div className="photo">
              <img src="" alt="유저이미지" />
            </div>
            <div className="listBox">
              <div className="nick">finish</div>
              <div className="listItem">
                <span>Lv. 38</span>
                <span className="average">
                  <em>평균</em>
                  <span>Lv 20</span>
                </span>
              </div>
            </div>
            <button className="disable" disabled>
              신청불가
            </button>
          </div>
          <div className="list">
            <div className="photo">
              <img src="" alt="유저이미지" />
            </div>
            <div className="listBox">
              <div className="nick">finish</div>
              <div className="listItem">
                <span>Lv. 38</span>
                <span className="average">
                  <em>평균</em>
                  <span>Lv 20</span>
                </span>
              </div>
            </div>
            <button className="disable" disabled>
              신청불가
            </button>
          </div>
          <div className="list">
            <div className="photo">
              <img src="" alt="유저이미지" />
            </div>
            <div className="listBox">
              <div className="nick">finish</div>
              <div className="listItem">
                <span>Lv. 38</span>
                <span className="average">
                  <em>평균</em>
                  <span>Lv 20</span>
                </span>
              </div>
            </div>
            <button className="disable" disabled>
              신청불가
            </button>
          </div>
        </div>
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/raffle/popClose.png" alt="닫기" />
        </button>
      </div>
    </div>
  )
}
