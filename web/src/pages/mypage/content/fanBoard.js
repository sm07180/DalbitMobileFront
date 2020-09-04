/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */
import React, {useEffect, useState, useContext, useRef} from 'react'
import {useParams} from 'react-router-dom'
import styled from 'styled-components'
//modules
import qs from 'query-string'
// context
import {Context} from 'context'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
//api
import Api from 'context/api'
//components
// import Header from '../component/header.js'
import Header from 'components/ui/new_header.js'
import BoardList from './board_list'
import WriteBoard from './board_write'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
//svg
import BJicon from '../component/bj.svg'
import closeBtn from '../component/ic_back.svg'
import ArrowDownIcon from '../static/arrow_down_g.svg'
import NoResult from 'components/ui/noResult'
// concat
let currentPage = 1
let timer
let moreState = false
//layout
export default (props) => {
  const {webview} = qs.parse(location.search)
  const params = useParams()

  //ref
  const inputEl = useRef(null)
  //context
  const ctx = useContext(Context)
  const context = useContext(Context)
  //profileGlobal info
  const {profile} = ctx
  //urlNumber
  var urlrStr = props.location.pathname.split('/')[2]
  //state
  const [boardList, setBoardList] = useState([])
  const [nextList, setNextList] = useState(false)
  const [writeState, setWriteState] = useState(false)
  const [textChange, setTextChange] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [isScreet, setIsScreet] = useState(false)
  const [isOther, setIsOther] = useState(true)

  //팬보드 댓글 온체인지
  const handleChangeBig = (e) => {
    const target = e.currentTarget
    if (target.value.length > 100) return
    setTextChange(e.target.value)
  }
  //스크롤 이벤트
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
        showMoreList()
      } else {
      }
    }, 10)
  }
  //콘켓 쇼모어 이벤트
  const showMoreList = () => {
    if (moreState) {
      setBoardList(boardList.concat(nextList))
      fetchData('next')
    }
  }
  //쓰기버튼 토글이벤트
  const WriteToggle = () => {
    if (writeState === false) {
      setWriteState(true)
    } else {
      setWriteState(false)
    }
  }
  // 팬보드 글 조회
  async function fetchData(next) {
    currentPage = next ? ++currentPage : currentPage
    const res = await Api.mypage_fanboard_list({
      params: {
        memNo: urlrStr,
        page: currentPage,
        records: 10
      }
    })
    if (res.result === 'success') {
      if (res.code === '0') {
        if (next !== 'next') {
          setBoardList(false)
          setTotalCount(0)
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextList(res.data.list)
          setTotalCount(res.data.paging.total)
        } else {
          setBoardList(res.data.list)
          setTotalCount(res.data.paging.total)
          fetchData('next')
        }
      }
    } else {
    }
  }

  const setAction = (value) => {
    if (value === true) {
      currentPage = 1
      fetchData()
    }
  }
  //재조회 및 초기조회
  useEffect(() => {
    currentPage = 1
    fetchData()
  }, [writeState, ctx.fanBoardBigIdx])
  //스크롤 콘켓
  useEffect(() => {
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextList])
  //팬보드 댓글추가
  async function fetchDataUpload() {
    const res = await Api.mypage_fanboard_upload({
      data: {
        memNo: urlrStr,
        depth: 1,
        content: textChange,
        viewOn: isScreet === true ? 0 : 1
      }
    })
    if (res.result === 'success') {
      WriteToggle()
      setTextChange('')
    } else if (res.result === 'fail') {
      if (textChange.length === 0) {
        context.action.alert({
          callback: () => {},
          msg: '답글 내용을 입력해주세요.'
        })
      }
    }
  }
  // const createWriteBtn = () => {
  //   return (
  //     <button onClick={() => WriteToggle()} className={[`write-btn ${urlrStr === context.token.memNo ? 'on' : 'on'}`]}>
  //       쓰기
  //     </button>
  //   )
  // }

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
      <Header title="팬보드" />
      <WriteBoard {...props} set={setAction} />

      {/* 팬보드 리스트 영역 */}
      {totalCount === 0 && <NoResult />}
      {totalCount !== 0 && <BoardList list={boardList} totalCount={totalCount} set={setAction} />}

      {/* <div className="writeWrap">
        <div className="writeWrap__top">
          <div
            className={`writeWrap__header ${writeState === true && 'writeWrap__header--active'}`}
            onClick={() => {
              if (writeState === false) setWriteState(true)
            }}>
            <img src={profile.profImg.thumb62x62} alt={profile.nickNm} />
            {writeState === false && (
              <span>
                글쓰기 <span className="gray">최대 100자</span>
              </span>
            )}
            {writeState === true && <strong>{profile.nickNm}</strong>}
          </div>
          {writeState === true && (
            <div className="content_area">
              <textarea placeholder="내용을 입력해주세요" onChange={handleChangeBig} value={textChange} />
            </div>
          )}
        </div>
        {writeState === true && (
          <div className="writeWrap__btnWrap">
            <span className="bigCount">
              <span className="bigCount__secret">
                <DalbitCheckbox
                  status={isScreet}
                  callback={() => {
                    setIsScreet(!isScreet)
                  }}
                />
                <span className="bold">비공개</span>
              </span>
              <span className="count">
                <em>{textChange.length}</em> / 100
              </span>
            </span>
            <button className="btn__ok" onClick={() => fetchDataUpload()}>
              등록
            </button>
          </div>
        )}
        {writeState === true && (
          <div
            className="writeWrap__btn"
            onClick={() => {
              context.action.updateFanboardReplyNum(-1)
              setWriteState(false)
            }}>
            <button className="btn__toggle">접기</button>
          </div>
        )}
      </div> */}
      {/* 팬보드 작성영역 */}
      {/* {writeState && (
        <Writer>
          <Header>
            <h2 className="header-title">팬보드 쓰기</h2>
          </Header>
          <div className="content_area">
            <Textarea placeholder="내용을 입력해주세요" onChange={handleChangeBig} value={textChange} />
            <span className="bigCount">
              {isOther === true && (
                <span className="bigCount__screet">
                  <DalbitCheckbox
                    status={isScreet}
                    callback={() => {
                      setIsScreet(!isScreet)
                    }}
                  />
                  <span className="bold">비공개</span>
                </span>
              )}

              <span>
                <em>{textChange.length}</em>&nbsp;/ 100
              </span>
            </span>
            <button onClick={() => fetchDataUpload()}>등록</button>
          </div>
        </Writer>
      )} */}
    </div>
  )
}
