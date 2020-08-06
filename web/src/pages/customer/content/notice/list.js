import React, {useState, useEffect} from 'react'

import {useHistory} from 'react-router-dom'

import Api from 'context/api'

import './list.scss'

let timer
let currentPage = 1
let moreState = false
let noMore = false
export default function List() {
  const history = useHistory()
  if (history.action === 'POP') {
    currentPage = 1
  }
  const [noticeList, setNoticeList] = useState([])
  const [listPage, setListPage] = useState([])
  const [nextListPage, setNextListPage] = useState([])

  const timestamp = String(new Date().getTime()).substr(0, 10)
  const IntTime = parseInt(timestamp)

  let mypageNewStg = localStorage.getItem('mypageNew')
  if (mypageNewStg !== undefined && mypageNewStg !== null && mypageNewStg !== '') {
    mypageNewStg = JSON.parse(mypageNewStg)
  } else {
    mypageNewStg = {}
  }
  const getNewIcon = (noticeIdx, isNew) => {
    if (isNew && mypageNewStg.notice !== undefined && mypageNewStg.notice !== null && mypageNewStg.notice !== '') {
      return mypageNewStg.notice.find((e) => e === parseInt(noticeIdx)) === undefined
    }
    return isNew
  }

  const fetchData = async function (next) {
    currentPage = next ? ++currentPage : currentPage

    const res = await Api.notice_list({
      params: {
        noticeType: 0,
        page: currentPage,
        records: 20
      }
    })

    const {result, data, code} = res
    if (result === 'success') {
      if (next) {
        setNextListPage(data.list)
        moreState = true
        if (data.paging.totalPage === data.paging.page) {
          noMore = true
        }
      } else {
        setListPage(data.list)
        fetchData('next')
        // if(currentPage < data.paging.totalPage) {
        //   fetchData('next')
        // } else if(currentPage === data.paging.totalPage){
        //   moreState = false;
        // }
      }
    }
  }
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset
      //스크롤이벤트체크
      /*
       * @가속처리
       */
      if (windowBottom >= docHeight - 200) {
        showMoreList()
      } else {
      }
    }, 10)
  }
  const showMoreList = () => {
    if (moreState) {
      setListPage(listPage.concat(nextListPage))
      if (noMore) {
        moreState = false
      } else {
        fetchData('next')
      }
    }
  }
  const routeHistory = (item) => {
    const {noticeIdx} = item

    history.push({
      pathname: `/customer/notice/${noticeIdx}`,
      state: {
        noticeIdx: noticeIdx
      }
    })
  }

  useEffect(() => {
    fetchData()
  }, [])
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextListPage])
  return (
    <>
      {listPage && (
        <div className="noticeList">
          <dl>
            {listPage.map((item, index) => {
              const {noticeType, writeDt, title, noticeIdx, writeTs, isNew} = item
              //console.log((IntTime - writeTs) / 3600)

              if (listPage === null) return
              return (
                <div key={index} onClick={() => routeHistory(item)}>
                  <div className="tableWrap">
                    <dd>
                      {noticeType !== 0 && (
                        <span className="tableWrap__label">
                          {noticeType === 1 ? '공지사항 ' : ''}
                          {noticeType === 2 ? '이벤트 ' : ''}
                          {noticeType === 3 ? '정기정검 ' : ''}
                          {noticeType === 4 ? '업데이트 ' : ''}
                          {noticeType === 5 ? '언론보도 ' : ''}
                        </span>
                      )}
                      <span className="tableWrap__title">{title}</span>
                      {getNewIcon(noticeIdx, isNew) && <em></em>}
                    </dd>
                  </div>
                </div>
              )
            })}
          </dl>
        </div>
      )}
    </>
  )
}
