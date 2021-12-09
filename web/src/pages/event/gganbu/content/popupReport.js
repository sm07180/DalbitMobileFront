import React, {useState, useEffect, useContext, useLayoutEffect, useCallback} from 'react'
//context
import Api from 'context/api'
import Utility from 'components/lib/utility'

import NoResult from 'components/ui/new_noResult'

import './search.scss'
import {Context} from 'context'

export default (props) => {
  const {setPopupReport, gganbuNo} = props
  const context = useContext(Context)

  const [reportList, setReportList] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

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

  let totalPage = 1
  let pagePerCnt = 50
  // 깐부 리포트 리스트 조회
  const gganbuReportList = useCallback(async () => {
    const {data, message} = await Api.postGganbuReportList({
      gganbuNo: gganbuNo,
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    })
    if (message === 'SUCCESS') {
      if (currentPage > 1) {
      setReportList(data.list)
    }
    } else {
      console.log(message)
    }
  }, [currentPage])

  const scrollEvtHdr = () => {
    if (totalPage > currentPage && Utility.isHitBottom()) {
      setCurrentPage(currentPage + 1)
    }
  }

  useLayoutEffect(() => {
    if (currentPage === 0) setCurrentPage(1)
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [currentPage])

  useEffect(() => {
    gganbuReportList()
  }, [])

  return (
    <div id="popupWrap" onClick={wrapClick}>
      <div className="contentWrap">
        <h1 className="title">구슬 리포트</h1>
        <div className="searchTitle">상세 내역</div>
        <div className="listWrap" style={{height: '364px'}}>
          {reportList.length > 0 &&
            reportList.map((data, index) => {
              const {mem_nick} = data
              return (
                <div className="list" key={index}>
                  <div className="photo">
                    <img src={context.profile.profImg} alt="유저이미지" />
                  </div>
                  <div className="listBox">
                    <div className="nick">{mem_nick}</div>
                    <div className="listItem">
                      <span className="category">청취</span>
                      <span className="time">청취</span>
                    </div>
                    <div className="listItem">
                      <span>Lv. 38</span>
                    </div>
                  </div>
                </div>
              )
            })}
          {reportList.length === 0 && <NoResult type="default" text="내역이 없습니다." />}
        </div>
        <button className="close" onClick={closePopup}>
          <img src="https://image.dalbitlive.com/event/raffle/popClose.png" alt="닫기" />
        </button>
      </div>
    </div>
  )
}
