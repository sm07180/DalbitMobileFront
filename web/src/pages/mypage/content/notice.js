import React, {useState, useCallback, useEffect, useContext, useReducer} from 'react'

import Api from 'context/api'
import NoticeInsertCompnent from './notice_insert'
import NoticeModifyCompnent from './notice_modify'
import NoticeListCompnent from './notice_list.js'
import NoticeDetailCompenet from './notice_detail'
import Header from 'components/ui/new_header.js'

// moible context
import {useLocation} from 'react-router-dom'
import {Context} from 'context'
import {useHistory} from 'react-router-dom'

import './notice.scss'

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

  //체크상태
  const initialState = {
    click1: false
  }
  const reducer = (state, action) => ({...state, ...action})
  const [state, setState] = useReducer(reducer, initialState)
  const [photoUploading, setPhotoUploading] = useState(false)

  // 기본 State
  const [noticeList, setNoticeList] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  //Component 호출
  const [isAdd, setIsAdd] = useState(false)
  const [isList, setIsList] = useState(true)
  const [isDetail, setIsDetail] = useState(false)
  const [modifyItem, setModifyItem] = useState(null)

  //Not Component 호출
  const [detailIdx, setDetailIdx] = useState(0)
  const [moreToggle, setMoreToggle] = useState(false)

  const memNo = globalCtx.profile.memNo

  const getNotice = useCallback(async () => {
    const {result, data} = await Api.mypage_notice_inquire({
      memNo: urlrStr,
      page: currentPage,
      records: 9999
    })
    if (result === 'success') {
      setNoticeList(data.list)
      if (data.paging) {
        setTotalPage(data.paging.totalPage)
      }
    } else {
      context.action.alert({
        msg: result.message,
        callback: () => {}
      })
    }
  }, [memNo, currentPage])

  const titleText = () => {
    if (isAdd === true) {
      return '방송공지 쓰기'
    } else if (modifyItem !== null) {
      return '방송공지 수정'
    } else {
      return '방송공지'
    }
  }

  const goBack = () => {
    //링크 진행중
    if (isList) {
      if (urlrStr === memNo) {
        history.push(`/menu/profile`)
      } else {
        history.push(`/mypage/${memNo}`)
      }
    }
    if (isAdd) {
      setIsAdd(false)
      setIsList(true)
    }
    if (modifyItem !== null) {
      setModifyItem(null)
      setIsDetail(true)
    }
    if (isDetail) {
      setIsDetail(false)
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
        className={`write-btn ${urlrStr === memNo ? 'on' : 'on'}`}>
        쓰기
      </button>
    )
  }

  useEffect(() => {
    getNotice()
  }, [currentPage])

  return (
    <div id="notice">
      {!props.type ? (
        <Header type="noBack">
          <h2 className="header-title">{titleText()}</h2>
          <button className="close-btn" onClick={goBack}>
            <img src="https://image.dalbitlive.com/svg/icon_back_gray.svg" alt="뒤로가기" />
          </button>
        </Header>
      ) : (
        <></>
      )}

      {isAdd === true && (
        <NoticeInsertCompnent
          setIsAdd={setIsAdd}
          memNo={memNo}
          getNotice={getNotice}
          setIsList={setIsList}
          setPhotoUploading={setPhotoUploading}
        />
      )}
      {modifyItem !== null && (
        <>
          {!props.type ? (
            <NoticeModifyCompnent
              modifyItem={modifyItem}
              setModifyItem={setModifyItem}
              memNo={memNo}
              getNotice={getNotice}
              setIsList={setIsList}
              setIsDetail={setIsDetail}
              setPhotoUploading={setPhotoUploading}
            />
          ) : (
            <NoticeModifyCompnent
              type="userprofile"
              modifyItem={modifyItem}
              setModifyItem={setModifyItem}
              memNo={memNo}
              getNotice={getNotice}
              setIsList={setIsList}
              setIsDetail={setIsDetail}
              setPhotoUploading={setPhotoUploading}
            />
          )}
        </>
      )}

      {isList === true && (
        <NoticeListCompnent
          urlrStr={urlrStr}
          noticeList={noticeList}
          detailIdx={detailIdx}
          setDetailIdx={setDetailIdx}
          setIsList={setIsList}
          setIsDetail={setIsDetail}
        />
      )}

      {isDetail === true && (
        <>
          {!props.type ? (
            <NoticeDetailCompenet
              urlrStr={urlrStr}
              noticeList={noticeList}
              detailIdx={detailIdx}
              currentPage={currentPage}
              setMoreToggle={setMoreToggle}
              setDetailIdx={setDetailIdx}
              setModifyItem={setModifyItem}
              setIsDetail={setIsDetail}
              setIsList={setIsList}
              memNo={memNo}
              moreToggle={moreToggle}
              getNotice={getNotice}
            />
          ) : (
            <NoticeDetailCompenet
              type="userprofile"
              urlrStr={urlrStr}
              noticeList={noticeList}
              detailIdx={detailIdx}
              currentPage={currentPage}
              setMoreToggle={setMoreToggle}
              setDetailIdx={setDetailIdx}
              setModifyItem={setModifyItem}
              setIsDetail={setIsDetail}
              setIsList={setIsList}
              memNo={memNo}
              moreToggle={moreToggle}
              getNotice={getNotice}
            />
          )}
        </>
      )}

      {photoUploading && (
        <div className="loadingWrap">
          <div className="loading">
            <span></span>
          </div>
        </div>
      )}

      {!props.type && isList === true && urlrStr === globalCtx.profile.memNo && createWriteBtn()}
    </div>
  )
}
export default Notice
