import React, {useState, useEffect, useContext, useLayoutEffect, useCallback} from 'react'
//context
import Api from 'context/api'
import moment from 'moment'

import NoResult from 'components/ui/new_noResult'

import './search.scss'

export default (props) => {
  const {setPopupReport, gganbuNumber} = props

  const [reportList, setReportList] = useState([])

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

  let pagePerCnt = 50
  // 깐부 리포트 리스트 조회
  const gganbuReportList = useCallback(async () => {
    const param = {
      gganbuNo: gganbuNumber,
      pageNo: 1,
      pagePerCnt: pagePerCnt
    }
    const {data, message} = await Api.postGganbuReportList(param)
    if (message === 'SUCCESS') {
      setReportList(data.list)
    } else {
      console.log(message)
    }
  }, [])

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
                    <img src={mem_profile.thumb50x50} alt="유저이미지" />
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
                        {chng_slct === 's' ? red_marble : `-${red_marble}`}
                      </span>
                      <span className="marble">
                        <img src="https://image.dalbitlive.com/event/gganbu/marble-yellow.png" />
                        {chng_slct === 's' ? yellow_marble : `-${yellow_marble}`}
                      </span>
                      <span className="marble">
                        <img src="https://image.dalbitlive.com/event/gganbu/marble-blue.png" />
                        {chng_slct === 's' ? blue_marble : `-${blue_marble}`}
                      </span>
                      <span className="marble">
                        <img src="https://image.dalbitlive.com/event/gganbu/marble-purple.png" />
                        {chng_slct === 's' ? violet_marble : `-${violet_marble}`}
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
