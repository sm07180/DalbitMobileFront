import React, {useState, useEffect} from 'react'

import {useHistory} from 'react-router-dom'
import Api from 'context/api'
import NoticeTab from 'pages/common/noticeTab'
import './list.scss'

let timer
let currentPage = 1
let moreState = false
let noMore = false
export default function List() {
  const history = useHistory()

  const [noticeList, setNoticeList] = useState([])
  // useState : 컴포넌트의 동적인 값인 state를 관리할 수 있음
  // noticeList, 동적인 값이므로 useState함수를 사용할 때에는 상태의 기본값을 파라미터로 넣어서 호출해줌
  // const [noticeList, setNoticeList] 에서 첫번째 원소는 현재 상태, 두번째 원소는 setter함수
  // setter함수는 파라미터로 전달 받은 값을 가장 최신 상태로 설정해줌
  const [listPage, setListPage] = useState([])
  // listPage를 관리하기 위함
  const [nextListPage, setNextListPage] = useState([])
  // nextListPage를 관리하기 위함
  const timestamp = String(new Date().getTime()).substr(0, 10)
  // 현재 시간을 millisecond로 10자리까지 표현
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

  useEffect(() => {
    console.log(mypageNewStg);
  })

  const fetchData = async function (next) {
    // async - await을 쓸 수 있도록 하기 위해서
    currentPage = next ? ++currentPage : currentPage

    const res = await Api.notice_list({
      // Api의 notice_list가 끝나기를 기다림, notice_list의 return value가 무엇이든 값을 res에 집어넣음
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
        if (data.paging) {
          if (data.paging.totalPage === data.paging.page) {
            noMore = true
          }
        } else {
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
    console.log(noticeIdx);
    history.push({
      pathname: `/notice/${noticeIdx}`,
      state: noticeIdx
    })
  }

  useEffect(() => {
    console.log(listPage)
  })

  useEffect(() => {
    // effect hook
    fetchData()

    return () => {
      currentPage = 1
      moreState = false
      noMore = false
    }
  }, [])
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextListPage])
  return (
    <>
      <NoticeTab />
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
