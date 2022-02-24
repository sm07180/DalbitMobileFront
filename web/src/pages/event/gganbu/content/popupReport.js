import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react'
//context
import Api from 'context/api'
import moment from 'moment'

import NoResult from 'components/ui/new_noResult'

import './search.scss'

export default (props) => {
  const {setPopupReport, gganbuNumber} = props

  const [reportList, setReportList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)

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
  const fetchgganbuReportList = useCallback(async () => {
    const param = {
      gganbuNo: gganbuNumber,
      pageNo: currentPage,
      pagePerCnt: pagePerCnt
    }
    const {data, message} = await Api.postGganbuReportList(param)
    if (message === 'SUCCESS') {
      totalPage = Math.ceil(data.listCnt / pagePerCnt)
      if (currentPage > 1) {
        setReportList(reportList.concat(data.list))
      } else {
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
    if (currentPage > 0) fetchgganbuReportList()
  }, [currentPage])

  return (
    <div id="popupWrap" onClick={wrapClick}>
      <div className="contentWrap">
        <h1 className="title">구슬 리포트</h1>
        <div className="searchTitle">상세 내역</div>
        <div className="listWrap" style={{height: '364px'}}>
          {reportList.length > 0 &&
            reportList.map((data, index) => {
              const {
                ins_slct,
                ins_date,
                chng_slct,
                mem_nick,
                mem_profile,
                red_marble,
                yellow_marble,
                blue_marble,
                violet_marble
              } = data
              return (
                <div className="list" style={{height: '72px'}} key={index}>
                  <div className="photo">
                    <img src={mem_profile.thumb292x292} alt="유저이미지" />
                  </div>
                  <div className="listBox">
                    <div className="nick">{mem_nick}</div>
                    <div className="listItem">
                      <span className="category">
                        {ins_slct === 'r'
                          ? '방송'
                          : ins_slct === 'v'
                          ? '청취'
                          : ins_slct === 'c'
                          ? '달구매'
                          : ins_slct === 'e'
                          ? '달교환'
                          : ins_slct === 'b'
                          ? '베팅소'
                          : ''}
                      </span>
                      <span className="time">{moment(ins_date).format('YYYY.MM.DD HH:mm:ss')}</span>
                    </div>
                    <div className="listItem">
                      <span className="marble">
                        <img src="https://image.dalbitlive.com/event/gganbu/marble-red.png" />
                        {chng_slct === 'u' && red_marble != 0 ? '-' : ''}
                        {red_marble}
                      </span>
                      <span className="marble">
                        <img src="https://image.dalbitlive.com/event/gganbu/marble-yellow.png" />
                        {chng_slct === 'u' && yellow_marble != 0 ? '-' : ''}
                        {yellow_marble}
                      </span>
                      <span className="marble">
                        <img src="https://image.dalbitlive.com/event/gganbu/marble-blue.png" />
                        {chng_slct === 'u' && blue_marble != 0 ? '-' : ''}
                        {blue_marble}
                      </span>
                      <span className="marble">
                        <img src="https://image.dalbitlive.com/event/gganbu/marble-purple.png" />
                        {chng_slct === 'u' && violet_marble != 0 ? '-' : ''}
                        {violet_marble}
                      </span>
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
