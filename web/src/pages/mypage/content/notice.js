import React, {useState, useCallback, useEffect, useContext, useReducer} from 'react'

import Api from 'context/api'
import NoticeInsertCompnent from './notice_insert'
import NoticeModifyCompnent from './notice_modify'
import NoticeListCompnent from './notice_list.js'
import NoticeDetailCompenet from './notice_detail'
import Header from 'components/ui/new_header.js'

import {useLocation, useHistory, useParams} from 'react-router-dom'
import {Context} from 'context'

import './notice.scss'

const Notice = (props) => {
  console.log(111)
  // moible 유저 정보
  const globalCtx = useContext(Context)
  //memNo
  let location = useLocation()
  let history = useHistory()

  let yourMemNo
  if (props.location) {
    yourMemNo = props.location.pathname.split('/')[2]
  } else {
    yourMemNo = location.pathname.split('/')[2]
  }

  let {memNo, addpage} = useParams()

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
  const [modifyItem, setModifyItem] = useState(null)

  //Not Component 호출
  const [detailIdx, setDetailIdx] = useState(0)

  const getNotice = useCallback(async () => {
    const {result, data} = await Api.mypage_notice_inquire({
      memNo: yourMemNo,
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
    if (addpage && addpage.indexOf('isWrite') === 0) {
      return '방송공지 쓰기'
    } else if (addpage && addpage.indexOf('isModify') === 0) {
      return '방송공지 수정'
    } else {
      return '방송공지'
    }
  }

  const makeView = () => {
    if (addpage == undefined || addpage === '') {
      return <NoticeListCompnent noticeList={noticeList} />
    } else if (addpage.indexOf('isDetail') !== -1) {
      return (
        <NoticeDetailCompenet
          yourMemNo={yourMemNo}
          noticeList={noticeList}
          detailIdx={detailIdx}
          currentPage={currentPage}
          setDetailIdx={setDetailIdx}
          getNotice={getNotice}
          setModifyItem={setModifyItem}
        />
      )
    } else if (addpage.indexOf('isWrite') === 0) {
      return <NoticeInsertCompnent memNo={memNo} getNotice={getNotice} setPhotoUploading={setPhotoUploading} />
    } else if (addpage.indexOf('isModify') === 0) {
      return (
        <>
          <NoticeModifyCompnent
            type="userprofile"
            modifyItem={modifyItem}
            setModifyItem={setModifyItem}
            memNo={memNo}
            getNotice={getNotice}
            setPhotoUploading={setPhotoUploading}
          />
        </>
      )
    } else {
      ;<></>
    }
  }

  const createWriteBtn = () => {
    return (
      <button
        onClick={() => {
          history.push(`/mypage/${memNo}/notice/isWrite`)
        }}
        className={`write-btn ${yourMemNo === memNo ? 'on' : 'on'}`}>
        쓰기
      </button>
    )
  }

  useEffect(() => {
    getNotice()
  }, [currentPage])

  return (
    <div id="notice">
      {!props.type && (
        <Header type="noBack">
          <h2 className="header-title">{titleText()}</h2>
          <button
            className="btnClose"
            onClick={() => {
              if (props.tabSelected === 0 && addpage && addpage.indexOf('isDetil') === 0) {
                history.goBack()
              } else if (props.tabSelected === 1 && addpage && addpage.indexOf('isDetil') === 0) {
                history.push(`/menu/profile`)
              } else if (addpage === undefined) {
                history.push(`/menu/profile`)
              } else {
                history.goBack()
              }
            }}>
            <img src="https://image.dalbitlive.com/svg/icon_back_gray.svg" alt="뒤로가기" />
          </button>
        </Header>
      )}

      {makeView()}

      {photoUploading && (
        <div className="loadingWrap">
          <div className="loading">
            <span></span>
          </div>
        </div>
      )}

      {addpage === undefined && !props.type && yourMemNo === globalCtx.profile.memNo && createWriteBtn()}
    </div>
  )
}
export default Notice
