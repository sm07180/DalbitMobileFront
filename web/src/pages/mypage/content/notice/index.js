import React, {useCallback, useEffect, useMemo, useState} from 'react'

import {useHistory, useParams} from 'react-router-dom'

import Header from 'components/ui/new_header.js'
import Api from 'context/api'

import qs from 'query-string'

import NoticeInsertCompnent from './content/notice_insert'
import NoticeModifyCompnent from './content/notice_modify'
import NoticeListCompnent from './content/notice_list'
import NoticeDetailCompenet from './content/notice_detail'

import './notice.scss'
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxMessage} from "redux/actions/globalCtx";

const records = 9999

let timer

function NoticeComponent(props) {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const history = useHistory()
  const {memNo, addpage} = useParams()
  const yourMemNo = memNo

  //체크상태
  const [photoUploading, setPhotoUploading] = useState(false)

  // 기본 State
  const [noticeList, setNoticeList] = useState([])
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [empty, setEmpty] = useState(false)

  const detailItem = useMemo(() => {
    if (noticeList.length > 0 && history.location.search) {
      if (noticeList.find((v) => v.noticeIdx == qs.parse(history.location.search).idx)) {
        return noticeList.find((v) => v.noticeIdx == qs.parse(history.location.search).idx)
      } else {
        return null
      }
    } else {
      return null
    }
  }, [qs, history.location.search, noticeList])

  const fetchData = useCallback(async () => {
    setCurrentPage(1)

    const {result, data, message} = await Api.mypage_notice_inquire({
      memNo: yourMemNo,
      page: 1,
      records: records
    })
    if (result === 'success') {
      if(data.list.length > 0) {
        setEmpty(false)
        setNoticeList(data.list)
        if (data.paging) {
          setTotalPage(data.paging.totalPage)
        }
      } else {
        setEmpty(true);
        setNoticeList([]);
        setTotalPage(1);
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
  }, [])

  const getNotice = async () => {
    if (noticeList.length > 0) {
      if (currentPage > 1) {
        const length = (currentPage - 1) * records
        if (noticeList.length > length) {
          return
        }
      }
    }

    const {result, data} = await Api.mypage_notice_inquire({
      memNo: yourMemNo,
      page: currentPage,
      records: records
    })
    if (result === 'success') {
      if (noticeList.length > 0) {
        setNoticeList(noticeList.concat(data.list))
      } else {
        setNoticeList(data.list)
        if (data.paging) {
          setTotalPage(data.paging.totalPage)
        }
      }
    } else {
      dispatch(setGlobalCtxMessage({
        type: "alert",
        msg: message
      }))
    }
  }

  const titleText = useMemo(() => {
    if (addpage && addpage.indexOf('isWrite') === 0) {
      return '방송공지 쓰기'
    } else if (addpage && addpage.indexOf('isModify') === 0) {
      return '방송공지 수정'
    } else {
      return '방송공지'
    }
  }, [addpage])

  const makeView = () => {
    if (addpage == undefined || addpage === '') {
      return <NoticeListCompnent noticeList={noticeList} emptyState={empty} />
    } else if (addpage.indexOf('isDetail') !== -1 && detailItem !== null) {
      return (
        <NoticeDetailCompenet
          yourMemNo={yourMemNo}
          detailItem={detailItem}
          setCurrentPage={setCurrentPage}
          noticeList={noticeList}
          setNoticeList={setNoticeList}
        />
      )
    } else if (addpage.indexOf('isWrite') === 0) {
      return <NoticeInsertCompnent memNo={memNo} fetchData={fetchData} setPhotoUploading={setPhotoUploading} />
    } else if (addpage.indexOf('isModify') === 0 && detailItem !== null) {
      return (
        <>
          <NoticeModifyCompnent
            type="userprofile"
            modifyItem={detailItem}
            memNo={memNo}
            setPhotoUploading={setPhotoUploading}
            setNoticeList={setNoticeList}
            noticeList={noticeList}
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
          history.push(`/mypage/${yourMemNo}/notice/isWrite`)
        }}
        className="write-btn">
        쓰기
      </button>
    )
  }

  useEffect(() => {
    if (currentPage !== 1) {
      getNotice()
    }
  }, [currentPage])

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    let didFetch = false
    const scrollEvHdr = () => {
      if (timer) window.clearTimeout(timer)
      if (addpage === undefined || addpage === '') {
        timer = window.setTimeout(() => {
          const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
          const body = document.body
          const html = document.documentElement
          const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
          )
          const windowBottom = windowHeight + window.pageYOffset
          const diff = 200
          if (!didFetch) {
            if (docHeight - diff < windowBottom) {
              if (totalPage > currentPage) {
                setCurrentPage(currentPage + 1)
              }
            }
          }
        }, 100)
      }
    }

    window.addEventListener('scroll', scrollEvHdr)

    return () => {
      window.removeEventListener('scroll', scrollEvHdr)
      didFetch = true
    }
  }, [currentPage, memNo, totalPage, addpage])

  return (
    <div id="broadcastNotice" className={`subContent gray ${props.type && `isTabContent`}`}>
      {!props.type && (
        <Header type="noBack">
          <h2 className="header-title">{titleText}</h2>
          <button
            className="btnClose"
            onClick={() => {
              history.goBack()
            }}>
            <img src="https://image.dallalive.com/svg/icon_back_gray.svg" alt="뒤로가기" />
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
      {(addpage === undefined || addpage === '') && yourMemNo == globalState.token.memNo && createWriteBtn()}
    </div>
  )
}

export default NoticeComponent
