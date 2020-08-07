import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'

import Api from 'context/api'

import './detail.scss'
import Utility from 'components/lib/utility'
export default function Detail() {
  const history = useHistory()

  const noticeIdx = history.location.pathname.split('/')[3]

  const [noticeDetail, setNoticeDetail] = useState(false)

  const fetchData = async function () {
    const res = await Api.notice_list_detail({
      params: {
        noticeIdx: noticeIdx
      }
    })

    const {result, data} = res

    if (result === 'success') {
      setNoticeDetail(data)
    }
  }

  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }

  const detailDate = () => {
    if (noticeDetail.writeDt !== undefined) {
      timeFormat(noticeDetail.writeDt)
      return timeFormat(noticeDetail.writeDt)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])
  if((((new Date()).getMilliseconds() / 1000) - noticeDetail.writeTs) < (7 * 24 * 3600)){
    let mypageNewStg = localStorage.getItem('mypageNew')
    if(mypageNewStg === undefined || mypageNewStg === null || mypageNewStg === ''){
      mypageNewStg = {}
    }else{
      mypageNewStg = JSON.parse(mypageNewStg)
    }
    if(mypageNewStg.notice === undefined || mypageNewStg.notice === null || mypageNewStg.notice === ''){
      mypageNewStg.notice = [parseInt(noticeIdx)]
    }else{
      if(mypageNewStg.notice.find(e => e === noticeIdx) === undefined) {
        mypageNewStg.notice.push(parseInt(noticeIdx))
      }
    }
    localStorage.setItem("mypageNew", JSON.stringify(mypageNewStg))
  }
  return (
    <>
      {noticeDetail !== false && (
        <div className="detail">
          <header>
            <span>{noticeDetail.title}</span>
            <span>{detailDate()}</span>
          </header>
          <div onClick={Utility.contentClickEvent}>
            <p dangerouslySetInnerHTML={{__html: noticeDetail.contents}}></p>
          </div>
          {/* <button>목록보기</button> */}
        </div>
      )}
    </>
  )
}
