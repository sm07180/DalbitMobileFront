import React, {useState, useEffect} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {Hybrid, isHybrid} from 'context/hybrid'
import Api from 'context/api'
import {IMG_SERVER} from 'context/config'
import qs from 'query-string'
import PresentTab from './contents/tab_present'
import CommentTab from './contents/tab_comment'
import './anniversary.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

export default function anniversaryEvent() {
  const history = useHistory()
  const location = useLocation()
  const {webview, type} = qs.parse(location.search)
  let urlrStr = qs.parse(location.search)
  const [tabState, setTabState] = useState('present')
  const [noticeData, setNoticeData] = useState(false)
  const [eventDate, setEventDate] = useState('')

  const dispatch = useDispatch();
  const dateFormatterKor = (num, type) => {
    if (!num) return ''
    var formatNum = ''
    num = num.replace(/\s/gi, '')
    num = num.substr(4, 4)
    try {
      formatNum = num.replace(/(\d{2})(\d{2})/, '$1월 $2일')
    } catch (e) {
      formatNum = num
      console.log(e)
    }
    return formatNum
  }
  async function fetchEventData() {
    const {result, data} = await Api.getVideoOpenEvent({
      slctType: 1,
      eventNo: 8
    })

    if (result === 'success') {
      setNoticeData(data.detailDesc)
      setEventDate(dateFormatterKor(data.startDt) + ' ~ ' + dateFormatterKor(data.endDt))
    } else {

      dispatch(setGlobalCtxMessage({type:'alert',
        msg: message
      }))
    }
  }

  const clickCloseBtn = () => {
    if (isHybrid() && webview && webview === 'new') {
      Hybrid('CloseLayerPopup')
    } else {
      return history.goBack()
    }
  }

  useEffect(() => {
    // 이벤트 관리자 데이터 호출
    fetchEventData()
    if (urlrStr.tab === 'comment') {
      setTabState('comment')
    }
  }, [])

  return (
    <div id="anniversaryEventPage">
      <div className="topBox">
        <button className="btnBack" onClick={() => clickCloseBtn()}>
          <img src={`${IMG_SERVER}/svg/close_w_l.svg`} alt="close" />
        </button>
        <img src={`${IMG_SERVER}/event/anniversary/main.png`} className="topBox_mainImg" alt="main Image" />
        <div className="topBox_datebox">
          이벤트 기간 : <strong>{eventDate}</strong>
        </div>
      </div>
      <div className="contentBox">
        <div className="tabBox">
          <button className={`btn ${tabState === 'present' && 'active'}`} onClick={() => setTabState('present')}>
            <span>EVENT 01</span>
            <span>선물 이벤트</span>
          </button>
          <button className={`btn ${tabState === 'comment' && 'active'}`} onClick={() => setTabState('comment')}>
            <span>EVENT 02</span>
            <span>댓글 이벤트</span>
          </button>
        </div>
        {tabState === 'present' && <PresentTab noticeData={noticeData} />}
        {tabState === 'comment' && <CommentTab tabState={tabState} setTabState={setTabState} />}
      </div>
    </div>
  )
}
