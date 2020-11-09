import React, {useState, useCallback, useEffect, useContext, useReducer} from 'react'
// import {useParams} from 'react-router-dom'
import Api from 'context/api'
// import {PHOTO_SERVER} from 'constant/define'
import NoticeInsertCompnent from './notice_insert'
import NoticeModifyCompnent from './notice_modify'
import NoticeListCompnent from './notice_list.js'
import NoticeDetailCompenet from './notice_detail'

import './notice.scss'

// moible context
import {useLocation} from 'react-router-dom'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'

import Header from '../component/header.js'
import WhitePen from '../component/images/WhitePen.svg'
import pen from 'images/pen.svg'
import {DalbitTextArea} from '../content/textarea'

const Notice = (props) => {
  // moible 유저 정보
  const globalCtx = useContext(Context)
  //memNo
  let location = useLocation()
  let history = useHistory()

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
  const [isList, setIsList] = useState(true)
  const [isDetaile, setIsDetaile] = useState(false)
  const [modifyItem, setModifyItem] = useState(null)

  //Not Component 호출
  const [detailIdx, setDetailIdx] = useState(0)
  const [moreToggle, setMoreToggle] = useState(false)

  const memNo = globalCtx.profile.memNo

  const getNotice = useCallback(async () => {
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

  const titleText = () => {
    if (isAdd === true) {
      return '방송공지 글쓰기'
    } else if (modifyItem !== null) {
      return '방송공지 수정'
    } else {
      return '방송공지'
    }
  }

  const goBack = () => {
    //링크 진행중
    if (isList) {
      history.push(`/mypage/${memNo}/notice`)
    }
    if (isAdd) {
      setIsAdd(false)
      setIsList(true)
    }
    if (modifyItem !== null) {
      setModifyItem(null)
      setIsDetaile(true)
    }
    if (isDetaile) {
      setIsDetaile(false)
      setIsList(true)
      setDetailIdx(0)
    }
  }

  const createWriteBtn = () => {
    return (
      <button
        onClick={() => {
          setIsAdd(!isAdd)
          setIsList(false)
        }}
        className={[`write-btn ${urlrStr === memNo ? 'on' : 'on'}`]}>
        쓰기
      </button>
    )
  }

  useEffect(() => {
    getNotice()
  }, [currentPage])

  console.log(`detailIdx`, detailIdx)

  return (
    <div id="notice">
      <div className="org header-wrap">
        {titleText()}
        <button className="close-btn" onClick={goBack}>
          <img src="https://image.dalbitlive.com/svg/icon_back_gray.svg" alt="뒤로가기" />
        </button>
      </div>

      {isAdd === true && <NoticeInsertCompnent setIsAdd={setIsAdd} memNo={memNo} getNotice={getNotice} setIsList={setIsList} />}
      {modifyItem !== null && (
        <NoticeModifyCompnent
          modifyItem={modifyItem}
          setModifyItem={setModifyItem}
          memNo={memNo}
          getNotice={getNotice}
          setIsList={setIsList}
          setIsDetaile={setIsDetaile}
        />
      )}

      {isList === true && (
        <NoticeListCompnent
          noticeList={noticeList}
          detailIdx={detailIdx}
          setDetailIdx={setDetailIdx}
          setMoreToggle={setMoreToggle}
          memNo={memNo}
          moreToggle={moreToggle}
          setIsList={setIsList}
          isDetaile={isDetaile}
          setIsDetaile={setIsDetaile}
        />
      )}
      {isDetaile === true && (
        <NoticeDetailCompenet
          noticeList={noticeList}
          detailIdx={detailIdx}
          currentPage={currentPage}
          setMoreToggle={setMoreToggle}
          setDetailIdx={setDetailIdx}
          setModifyItem={setModifyItem}
          setIsDetaile={setIsDetaile}
          setIsList={setIsList}
          memNo={memNo}
          moreToggle={moreToggle}
          getNotice={getNotice}
        />
      )}

      {/* {totalPage !== 0 && noticeList !== null && (
        <Pagenation
          setPage={(param) => {
            setCurrentPage(param)
          }}
          currentPage={currentPage}
          totalPage={totalPage}
          count={5}
        />
      )} */}

      {isList === true && urlrStr === globalCtx.profile.memNo && createWriteBtn()}
    </div>
  )
}
export default Notice
