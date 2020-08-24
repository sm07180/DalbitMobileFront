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
import {WIDTH_PC, WIDTH_TABLET, IMG_SERVER} from 'context/config'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
//api
import Api from 'context/api'
//components
import Header from '../component/header.js'
import Content from './fanBoard_content'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
//svg
import BJicon from '../component/bj.svg'
import BackIcon from '../component/ic_back.svg'
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
  const [list, setList] = useState([])
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
      setList(list.concat(nextList))
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
  //------------전체 팬보드 큰댓글 조회
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
          setList(false)
          setTotalCount(0)
        }
        moreState = false
      } else {
        if (next) {
          moreState = true
          setNextList(res.data.list)
          setTotalCount(res.data.paging.total)
        } else {
          setList(res.data.list)
          setTotalCount(res.data.paging.total)
          fetchData('next')
        }
      }
    } else {
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
      // context.action.alert({
      //   cancelCallback: () => {},
      //   msg: res.message
      // })
    }
  }
  //render
  const createWriteBtn = () => {
    // if (urlrStr === profile.memNo) {
    return (
      <button onClick={() => WriteToggle()} className={[`write-btn ${urlrStr === context.token.memNo ? 'on' : 'on'}`]}>
        쓰기
      </button>
    )
    // } else {
    // return null
    // }
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
    <FanBoard>
      {/* 팬보드 헤더 영역 */}
      <Header>
        <div className="category-text">팬보드</div>
        {createWriteBtn()}
      </Header>
      {/* 팬보드 리스트 영역 */}
      {totalCount === 0 && <NoResult />}
      {totalCount !== 0 && <Content list={list} totalCount={totalCount} />}
      {/* 팬보드 작성영역 */}
      {writeState && (
        <Writer>
          <header>
            <button onClick={WriteToggle}></button>
            <span>팬보드 쓰기</span>
          </header>
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
                <em>{textChange.length}</em> / 100
              </span>
            </span>
            <button onClick={() => fetchDataUpload()}>등록</button>
          </div>
        </Writer>
      )}
    </FanBoard>
  )
}
//STYLE
const Writer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 22;
  width: 100%;
  height: 100vh;
  background-color: #eeeeee;
  header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 100%;
    background-color: #fff;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: normal;
    text-align: center;
    color: #000000;
    > button {
      position: absolute;
      left: 6px;
      top: 0;
      width: 40px;
      height: 40px;
      background: url(${BackIcon}) no-repeat center center / cover;
    }
  }
  /* 팬보드 컨텐츠작성영역 */
  .content_area {
    display: flex;
    flex-direction: column;
    padding: 12px 16px;

    :after {
      content: '';
      clear: both;
      display: block;
    }
    > textarea {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
      min-height: 220px;
      border-radius: 12px;
      border: solid 1px #e0e0e0;
      :focus {
        border: solid 1px #000;
      }
      ::placeholder {
        font-size: 14px;
        letter-spacing: normal;
        text-align: left;
        color: #bdbdbd;
      }
    }
    .bigCount {
      > em {
        color: #000;
        font-style: normal;
        font-weight: 800;
      }
      display: flex;
      margin-right: 7px;
      margin-top: 4px;
      margin-bottom: 23px;
      font-size: 12px;
      line-height: 1.08;
      letter-spacing: normal;
      text-align: right;
      color: #616161;
      &__screet {
        display: flex;
        flex: 1;
        align-items: center;

        & > input {
          margin-right: 10px;
        }

        & > .bold {
          font-size: 14px;
          font-weight: bold;
        }
        span {
          font-size: 12px;
        }
      }

      & > span:last-child {
        display: flex;
        align-items: center;
      }
    }
    > button {
      height: 44px;
      border-radius: 12px;
      background-color: ${COLOR_MAIN};
      font-size: 18px;
      font-weight: 600;
      text-align: center;
      color: #ffffff;
    }
  }
`
const Textarea = styled.textarea``
//최상위
const FanBoard = styled.div`
  width: 100%;
  position: relative;
`
