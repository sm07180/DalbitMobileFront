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
import Header from 'components/ui/new_header.js'
import BoardList from './board_list'
import BoardItem from './board_item'
import WriteBoard from './board_write'
//svg
import NoResult from 'components/ui/noResult'
// concat
// let currentPage = 1
// let timer
// let total = 2
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
  const [totalCount, setTotalCount] = useState(-1)
  const [isOther, setIsOther] = useState(true)
  const [moreState, setMoreState] = useState(false)

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
    if (writeType !== 'clip_board') {
      fetchDataReplyList(context.fanboardReplyNum)
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

  const boardType = props.type
  //state
  const [replyWriteState, setReplyWriteState] = useState(false)
  const [boardReplyList, setBoardReplyList] = useState([])
  //정보 댓글로 전달
  const ReplyInfoTransfer = (boardIdx, item) => {
    context.action.updateReplyIdx(boardIdx)
    setReplyWriteState(true)
    //drill reply fetch
    fetchDataReplyList(boardIdx)
    //분기 체크
    if (context.fanboardReplyNum === boardIdx) {
      context.action.updateFanboardReplyNum(-1)
    } else {
      context.action.updateFanboardReplyNum(boardIdx)
    }
    context.action.updateFanboardReply(item)
    context.action.updateToggleAction(true)
    //초기화
    context.action.updateBoardIdx(0)
    context.action.updateBoardModifyInfo(null)
    // window.scrollTo({top: 0, left: 0, behavior: 'auto'})
  }
  //대댓글 클릭시 포커스
  useEffect(() => {
    console.log('..', context.fanboardReplyNum)
    if (context.fanboardReplyNum && context.fanboardReplyNum !== -1) {
      console.log(document.getElementsByClassName('list-item on'))
      window.scrollTo(0, document.getElementsByClassName('list-item on')[0].offsetTop - 10)
    }
  }, [context.fanboardReplyNum])
  // 팬보드 댓글 조회
  async function fetchDataReplyList(boardIdx) {
    const res = await Api.member_fanboard_reply({
      params: {
        memNo: urlrStr,
        replyIdx: boardIdx
      }
    })
    if (res.result === 'success') {
      setBoardReplyList(res.data.list)
    } else if (res.result === 'fail') {
    }
  }
  // const setAction = (value, writeType) => {
  //   if (value === true) {
  //     props.set(true)
  //     if (writeType !== 'clip_board') {
  //       fetchDataReplyList(context.fanboardReplyNum)
  //     }
  //   }
  // }

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
    context.action.updateSetBack(null)
    if (profile.memNo === urlrStr) {
      setIsOther(true)
    } else {
      setIsOther(false)
    }
    if (context.token.memNo === profile.memNo) {
      getMyPageNewFanBoard()
    }

    // return () => {
    //   currentPage = 1
    // }
  }, [])

  //--------------------------------------------------
  return (
    <div className="fanboard">
      {!props.type ? <Header title="팬보드" /> : <></>}
      <WriteBoard {...props} set={setAction} />
      {/* 팬보드 리스트 영역 */}
      {/* {totalCount === -1 && (
        <div className="loading">
          <span></span>
        </div>
      )}
      {totalCount === 0 && <NoResult />} */}
      {/* {totalCount > 0 && <BoardList list={boardList} totalCount={totalCount} set={setAction} />} */}

      {totalCount > 0 ? (
        <div className="listWrap">
          <>
            {totalCount && (
              <div className="list-count">
                <span>게시글</span>
                <span>{totalCount}</span>
              </div>
            )}
            {boardList &&
              boardList !== false &&
              boardList.map((item, index, self) => {
                const {replyCnt, replyIdx} = item
                return (
                  <React.Fragment key={index}>
                    <div className={`list-item ${replyIdx === context.fanboardReplyNum && 'on'}`}>
                      {item && <BoardItem key={`board-${index}`} data={item} set={props.set} type={boardType} />}
                      {boardType !== 'clip_board' && (
                        <div className="list-item__bottom">
                          <button className="btn__reply" onClick={() => ReplyInfoTransfer(replyIdx, item)}>
                            {replyCnt > 0 ? (
                              <>
                                답글 <em>{replyCnt}</em>
                              </>
                            ) : (
                              <>답글쓰기</>
                            )}
                          </button>
                        </div>
                      )}
                      {replyIdx === context.fanboardReplyNum &&
                        boardReplyList &&
                        boardReplyList !== false &&
                        boardReplyList.map((item1, index1) => {
                          return (
                            <div
                              className={
                                item1.replyIdx === (context.boardModifyInfo && context.boardModifyInfo.replyIdx)
                                  ? `reply-list modify`
                                  : `reply-list `
                              }
                              key={index1}>
                              <BoardItem
                                key={`reply-${index1}`}
                                data={item1}
                                set={setAction}
                                isViewOn={context.fanboardReply.viewOn}
                                replyShowIdx={context.fanboardReplyNum}
                                titleReplyInfo={context.fanboardReply}
                              />
                            </div>
                          )
                        })}
                      {replyIdx === context.fanboardReplyNum && replyWriteState && (
                        <WriteBoard
                          isViewOn={context.fanboardReply.viewOn}
                          replyWriteState={replyWriteState}
                          set={setAction}
                          type={'reply'}
                          list={self}
                        />
                      )}
                    </div>
                  </React.Fragment>
                )
              })}
          </>
        </div>
      ) : (
        <div className="loading">
          <span></span>
        </div>
      )}
    </div>
  )
}
