/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */
import React, {useEffect, useState, useContext, useRef} from 'react'
import {useParams} from 'react-router-dom'
//modules
import qs from 'query-string'
// context
import {Context} from 'context'
//api
import Api from 'context/api'
//components
// import Header from '../component/header.js'
import Header from 'components/ui/new_header.js'
import BoardList from './board_list'
import WriteBoard from './board_write'
//svg
import NoResult from 'components/ui/noResult'
// concat
let currentPage = 1
let timer
let total = 2
//layout
export default (props) => {
  //context
  const ctx = useContext(Context)
  const context = useContext(Context)
  const {profile} = ctx
  //urlNumber
  let urlrStr
  if (props.location) {
    urlrStr = props.location.pathname.split('/')[2]
  } else {
    urlrStr = location.pathname.split('/')[2]
  }
  //state
  const [boardList, setBoardList] = useState([])
  const [nextList, setNextList] = useState(false)
  const [writeState, setWriteState] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [isOther, setIsOther] = useState(true)
  const [moreState, setMoreState] = useState(false)
  // 스크롤 이벤트
  const scrollEvtHdr = (event) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(function () {
      //스크롤
      const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
      const body = document.body
      const html = document.documentElement
      const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      const windowBottom = windowHeight + window.pageYOffset

      if (moreState && windowBottom >= docHeight - 200) {
        // console.log(boardList.length)
        // console.log(currentPage * 10)

        showMoreList()
      } else {
      }
    }, 10)
  }
  // 스크롤 더보기
  const showMoreList = async () => {
    if (moreState) {
      let a = boardList.concat(nextList)
      // console.log(boardList)
      // console.log(nextList)
      let obj = {}
      a.forEach((v) => {
        obj[v.boardIdx] = v
      })

      setBoardList(
        Object.keys(obj).map((v) => {
          return obj[v]
        })
      )

      if (total >= currentPage) {
        await fetchData('next')
      }
    }
  }
  const setAction = (value) => {
    if (value === true) {
      currentPage = 1
      fetchData()
    }
  }
  // 팬보드 글 조회
  async function fetchData(next) {
    currentPage = next ? ++currentPage : currentPage
    // console.log(next, currentPage)
    const res = await Api.mypage_fanboard_list({
      params: {
        memNo: urlrStr,
        page: 1,
        records: 10000
      }
    })

    if (res.result === 'success') {
      if (res.code === '0') {
        if (next !== 'next') {
          setBoardList(false)
          setTotalCount(0)
        }
        setMoreState(false)
      } else {
        if (next) {
          setMoreState(true)
          setNextList(res.data.list)
          setTotalCount(res.data.paging.total)
        } else {
          setBoardList(res.data.list)
          setTotalCount(res.data.paging.total)
          fetchData('next')
        }
      }

      if (total === 2) {
        if (res.data.paging) total = res.data.paging.totalPage
      }
    } else {
    }
  }
  async function getMyPageNewFanBoard() {
    const newFanBoard = await Api.getMyPageNewFanBoard()
    let mypageNewStg = localStorage.getItem('mypageNew')
    if (mypageNewStg === undefined || mypageNewStg === null || mypageNewStg === '') {
      mypageNewStg = {}
    } else {
      mypageNewStg = JSON.parse(mypageNewStg)
    }
    const fanBoard = newFanBoard.data
    mypageNewStg.fanBoard = fanBoard === undefined || fanBoard === null || fanBoard === '' ? 0 : fanBoard
    localStorage.setItem('mypageNew', JSON.stringify(mypageNewStg))
  }
  //재조회 및 초기조회
  useEffect(() => {
    currentPage = 1
    fetchData()
  }, [writeState])
  // useEffect(() => {
  //   window.addEventListener('scroll', scrollEvtHdr)
  //   return () => {
  //     window.removeEventListener('scroll', scrollEvtHdr)
  //   }
  // }, [nextList])
  useEffect(() => {
    if (profile.memNo === urlrStr) {
      setIsOther(false)
    } else {
      setIsOther(true)
    }
    if (context.token.memNo === profile.memNo) {
      getMyPageNewFanBoard()
    }
    return () => {
      currentPage = 1
    }
  }, [])

  //--------------------------------------------------
  return (
    <div className="fanboard">
      {!props.type ? <Header title="팬보드" /> : <></>}
      <WriteBoard {...props} set={setAction} />

      {/* 팬보드 리스트 영역 */}
      {totalCount === 0 && <NoResult />}
      {totalCount !== 0 && <BoardList list={boardList} totalCount={totalCount} set={setAction} />}
    </div>
  )
}
