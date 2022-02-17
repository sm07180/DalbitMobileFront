/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */
import React, {useEffect, useRef, useState} from 'react'
//modules
// context
//api
import Api from 'context/api'
//components
import Header from 'components/ui/new_header.js'
import BoardList from './board_list'
import WriteBoard from './board_write'
//svg
import NoResult from 'components/ui/new_noResult'
import UserReport from "pages/mypage/content/user_report";
import {useDispatch, useSelector} from "react-redux";
import {setGlobalCtxBackState} from "redux/actions/globalCtx";
// concat
// let currentPage = 1
// let timer
// let total = 2
//layout
export default (props) => {
  const dispatch = useDispatch();
  const globalState = useSelector(({globalCtx}) => globalCtx);

  const {profile} = globalState
  //urlNumber
  let urlrStr
  if (props.location) {
    urlrStr = props.location.pathname.split('/')[2]
  } else {
    urlrStr = location.pathname.split('/')[2]
  }
  const BoardListRef = useRef()
  //state
  const [boardList, setBoardList] = useState([])
  const [nextList, setNextList] = useState(false)
  const [writeState, setWriteState] = useState(false)
  const [totalCount, setTotalCount] = useState(-1)
  const [isOther, setIsOther] = useState(true)
  const [moreState, setMoreState] = useState(false)
  const [isWriteBtn, setIsWriteBtn] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // 스크롤 이벤트
  // const scrollEvtHdr = (event) => {
  //   if (timer) window.clearTimeout(timer)
  //   timer = window.setTimeout(function () {
  //     //스크롤
  //     const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
  //     const body = document.body
  //     const html = document.documentElement
  //     const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  //     const windowBottom = windowHeight + window.pageYOffset

  //     if (moreState && windowBottom >= docHeight - 200) {

  //       showMoreList()
  //     } else {
  //     }
  //   }, 10)
  // }
  // 스크롤 더보기
  const showMoreList = async () => {
    if (moreState) {
      let a = boardList.concat(nextList)
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
      // currentPage = 1
      fetchData()
    }
    if (props.set) {
      props.set(true)
    }
  }
  // 팬보드 글 조회
  async function fetchData(next) {
    // currentPage = next ? ++currentPage : currentPage
    const res = await Api.mypage_fanboard_list({
      params: {
        memNo: urlrStr,
        page: 1,
        records: 10000
      }
    })
    if (res.result === 'success') {
      setBoardList(res.data.list)
      if (res.data.paging) {
        setTotalCount(res.data.paging.total)
      } else {
        setTotalCount(0)
      }
      //   if (res.code === '0') {
      //     if (next !== 'next') {
      //       setBoardList(false)
      //       setTotalCount(0)
      //     }
      //     setMoreState(false)
      //   } else {
      //     if (next) {
      //       setMoreState(true)
      //       setNextList(res.data.list)
      //       setTotalCount(res.data.paging.total)
      //     } else {
      //       setBoardList(res.data.list)
      //       setTotalCount(res.data.paging.total)
      //       fetchData('next')
      //     }
      //   }
      //   if (total === 2) {
      //     if (res.data.paging) total = res.data.paging.totalPage
      //   }
      // } else {
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
  const windowScrollEvent = () => {
    const boardListNode = BoardListRef.current
    if(boardListNode) {
      const boardListHeight = boardListNode.offsetTop
      if (props.type) {
        if (props.isShowBtn) {
          setIsWriteBtn(true)
        } else {
          setIsWriteBtn(false)
        }
      } else {
        if (window.scrollY >= boardListHeight) {
          setIsWriteBtn(true)
          setScrollY(boardListHeight)
        } else {
          setIsWriteBtn(false)
          setScrollY(0)
        }
      }
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', windowScrollEvent)
    return () => {
      window.removeEventListener('scroll', windowScrollEvent)
    }
  }, [props.isShowBtn])

  //재조회 및 초기조회
  useEffect(() => {
    //currentPage = 1
    fetchData()
  }, [writeState, urlrStr])
  // useEffect(() => {
  //   window.addEventListener('scroll', scrollEvtHdr)
  //   return () => {
  //     window.removeEventListener('scroll', scrollEvtHdr)
  //   }
  // }, [nextList])
  useEffect(() => {
    dispatch(setGlobalCtxBackState(null))
    if (profile.memNo === urlrStr) {
      setIsOther(true)
    } else {
      setIsOther(false)
    }
    if (globalState.token.memNo === profile.memNo) {
      getMyPageNewFanBoard()
    }

    // return () => {
    //   currentPage = 1
    // }
  }, [])

  //--------------------------------------------------
  return (
    <div className="fanboard">
      {!props.type ? (
        <Header>
          <h2 className="header-title">팬보드</h2>
        </Header>
      ) : (
        <></>
      )}
      <WriteBoard {...props} isShowBtn={isWriteBtn} set={setAction} />
      {/* 팬보드 리스트 영역 */}
      {totalCount === -1 && (
        <div className="loading">
          <span></span>
        </div>
      )}
      {totalCount === 0 && <NoResult type="default" text="등록된 팬보드가 없습니다." />}
      {totalCount > 0 && (
        <div ref={BoardListRef}>
          <BoardList list={boardList} boardType={props.type} totalCount={totalCount} set={setAction}/>
        </div>
      )}
      {globalState.userReport.state === true && <UserReport {...props} urlrStr={globalState.userReport.targetMemNo}/>}
    </div>
  )
}
