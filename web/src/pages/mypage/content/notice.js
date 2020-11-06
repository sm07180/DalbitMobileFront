import React, {useState, useCallback, useEffect, useContext, useReducer} from 'react'
// import {useParams} from 'react-router-dom'
import Api from 'context/api'
// import {PHOTO_SERVER} from 'constant/define'
import NoticeInsertCompnent from './notice_insert.js'
import NoticeModifyCompnent from './notice_modify.js'

// import './notice.scss'

// moible context
import {useLocation} from 'react-router-dom'
import {Context} from 'context'
import Header from '../component/header.js'
import WhitePen from '../component/images/WhitePen.svg'
import pen from 'images/pen.svg'
import {DalbitTextArea} from '../content/textarea'

const Notice = (props) => {
  // moible 유저 정보
  const globalCtx = useContext(Context)
  //memNo
  let location = useLocation()

  let urlrStr
  if (props.location) {
    urlrStr = props.location.pathname.split('/')[2]
  } else {
    urlrStr = location.pathname.split('/')[2]
  }

  const [listPage, setListPage] = useState(-1)
  const [nextListPage, setNextListPage] = useState([])

  //체크상태
  const initialState = {
    click1: false
  }
  const reducer = (state, action) => ({...state, ...action})
  const [state, setState] = useReducer(reducer, initialState)

  // 기본 State
  const [noticeList, setNoticeList] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  //Component 호출
  const [isAdd, setIsAdd] = useState(false)
  const [modifyItem, setModifyItem] = useState(null)

  //Not Component 호출
  const [detailIdx, setDetailIdx] = useState(0)
  const [moreToggle, setMoreToggle] = useState(false)

  const memNo = globalCtx.profile.memNo

  const getNotice = useCallback(async () => {
    setMoreToggle(false)

    const {result, data} = await Api.mypage_notice_inquire({
      memNo: urlrStr,
      page: currentPage,
      records: 10
    })
    if (result === 'success') {
      setNoticeList(data.list)
      if (data.paging) {
        setTotalPage(data.paging.totalPage)
      }
    }
  }, [memNo, currentPage])

  const deleteNotice = useCallback(
    (noticeIdx) => {
      async function deleteNoiceContent() {
        const res = await Api.mypage_notice_delete({
          memNo: context.profile.memNo,
          noticeIdx: noticeIdx
        })
        if (res.result === 'success') {
          getNotice()
        }
      }
      deleteNoiceContent()
    },
    [memNo, currentPage]
  )

  const createWriteBtn = () => {
    return (
      <button
        onClick={() => {
          setIsAdd(!isAdd)
        }}
        className={[`write-btn ${urlrStr === memNo ? 'on' : 'on'}`]}>
        쓰기
      </button>
    )
  }

  useEffect(() => {
    getNotice()
  }, [currentPage])

  return (
    <>
      <Header>
        <h2 className="header-title">방송공지</h2>
        {urlrStr === memNo && createWriteBtn()}
      </Header>
      {isAdd === true && <NoticeInsertCompnent setIsAdd={setIsAdd} memNo={memNo} getNotice={getNotice} />}
      {modifyItem !== null && (
        <NoticeModifyCompnent modifyItem={modifyItem} setModifyItem={setModifyItem} memNo={memNo} getNotice={getNotice} />
      )}
    </>
  )
}
export default Notice
