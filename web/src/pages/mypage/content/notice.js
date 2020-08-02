import React, {useState, useEffect, useContext, useReducer} from 'react'
import styled from 'styled-components'

import Api from 'context/api'

// context
import {Context} from 'context'

// component
import List from '../component/notice/list.js'
import WritePage from '../component/notice/writePage.js'
import Header from '../component/header.js'
import Paging from 'components/ui/paging.js'
import NoResult from 'components/ui/noResult'
import Checkbox from './checkbox'
// image,color //
import pen from 'images/pen.svg'

import WhitePen from '../component/images/WhitePen.svg'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {IMG_SERVER, WIDTH_MOBILE} from 'context/config'

// concat
let currentPage = 1
let timer
let moreState = false
const Notice = (props) => {
  //context
  const ctx = useContext(Context)
  const context = useContext(Context)
  //memNo
  const urlrStr = props.location.pathname.split('/')[2]
  //concat
  const [listPage, setListPage] = useState(-1)
  const [nextListPage, setNextListPage] = useState([])

  //체크상태
  const initialState = {
    click1: false
  }
  //---------------------------------------------------------------------
  const reducer = (state, action) => ({...state, ...action})
  const [state, setState] = useReducer(reducer, initialState)
  const [coment, setComment] = useState('')
  const [comentContent, setCommentContent] = useState('')
  const [writeShow, setWriteShow] = useState(false)
  const [writeBtnState, setWriteBtnState] = useState(false)
  const [thisMemNo, setThisMemNo] = useState(false)

  //공지제목 등록 온체인지
  const textChange = (e) => {
    const target = e.currentTarget
    if (target.value.length > 20) return
    setComment(target.value)
  }
  //공지컨텐트 등록 온체인지
  const textChangeContent = (e) => {
    const target = e.currentTarget
    if (target.value.length > 189) return
    setCommentContent(target.value)
  }
  //api
  const NoticeUpload = () => {
    async function fetcNoticeUpload() {
      const res = await Api.mypage_notice_upload({
        data: {
          memNo: urlrStr,
          title: coment,
          contents: comentContent,
          isTop: state.click1
        }
      })
      if (res.result === 'success') {
        setState({click1: false})
        context.action.confirm({
          callback: () => {
            setWriteShow(false)
            setTimeout(() => {
              setComment('')
              setCommentContent('')
              context.action.updateNoticeState(true)
            }, 10)
          },
          msg: '공시사항을 등록 하시겠습니까?'
        })
      } else if (res.result === 'fail') {
        if (coment.length === 0) {
          context.action.alert({
            cancelCallback: () => {},
            msg: '공지사항 제목을 입력해주세요.'
          })
        }
        if (comentContent.length === 0) {
          context.action.alert({
            cancelCallback: () => {},
            msg: '공지사항 내용을 입력해주세요.'
          })
        }
      }
    }
    if (writeBtnState === true) {
      fetcNoticeUpload()
    }
  }
  const WriteToggle = () => {
    setComment('')
    setCommentContent('')
    if (writeShow === false) {
      setWriteShow(true)
    } else {
      setWriteShow(false)
    }
  }
  const WritBtnActive = () => {
    if (coment !== '' && comentContent !== '') {
      setWriteBtnState(true)
    } else {
      setWriteBtnState(false)
    }
  }
  //---------------------------------------------------------------------
  useEffect(() => {
    WritBtnActive()
  }, [coment, comentContent])
  //-----------------------------------------------------------------------
  //리스트
  async function fetchData(next) {
    currentPage = next ? ++currentPage : currentPage

    const params = {
      memNo: urlrStr,
      page: 1,
      records: 20 * currentPage
    }
    const res = await Api.mypage_notice_inquire(params)
    if (res.result === 'success') {
      if (res.data.paging.totalPage === 1) {
        if (next) {
          moreState = false
          setNextListPage(res.data.list)
        } else {
          setListPage(res.data.list)
        }
      } else {
        if (next) {
          moreState = true
          setNextListPage(res.data.list)
        } else {
          setListPage(res.data.list)
          fetchData('next')
        }
      }
    } else if (res.result === 'fail') {
    }
  }
  useEffect(() => {
    currentPage = 1

    fetchData()
    setTimeout(() => {
      context.action.updateNoticeState(false)
    }, 50)
  }, [context.noticeState])

  const showMoreList = () => {
    if (moreState) {
      setListPage(nextListPage)
      fetchData('next')
    } else {
      // setListPage(nextListPage)
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
  useEffect(() => {
    //reload
    window.addEventListener('scroll', scrollEvtHdr)
    return () => {
      window.removeEventListener('scroll', scrollEvtHdr)
    }
  }, [nextListPage])
  ///
  useEffect(() => {
    const settingProfileInfo = async (memNo) => {
      const profileInfo = await Api.profile({
        params: {memNo: context.token.memNo}
      })
      if (profileInfo.result === 'success') {
        setThisMemNo(profileInfo.data.memNo)
      }
    }
    settingProfileInfo()
  }, [])

  const createWriteBtn = () => {
    if (urlrStr === thisMemNo) {
      return (
        <button onClick={() => WriteToggle()} className={[`write-btn ${urlrStr === ctx.profile.memNo ? 'on' : ''}`]}>
          쓰기
        </button>
      )
    } else {
      return null
    }
  }

  //-----------------------------------------------------------------------
  //토글
  const [numbers, setNumbers] = useState('')

  const toggler = (noticeIdx) => {
    if (numbers === noticeIdx) {
      setNumbers('')
      setTimeout(() => {
        setNumbers(noticeIdx)
      }, 10)
    } else {
      setNumbers(noticeIdx)
      setTimeout(() => {
        const height = document.querySelector(`.idx${noticeIdx}`).offsetTop - 60
        window.scrollTo(0, height)
      }, 10)
    }
  }

  return (
    <>
      <Header>
        <div className="category-text">방송공지</div>
        {createWriteBtn()}
      </Header>
      {listPage === -1 ? (
        <NoResult />
      ) : (
        <>
          {listPage.length !== -1 && (
            <>
              <ListWrap className="noticeIsTop">
                {Array.isArray(listPage) &&
                  listPage.map((list, idx) => {
                    const {isTop, title, contents, writeDt, noticeIdx} = list
                    return (
                      <div key={idx}>
                        {isTop === true && (
                          <a className={`idx${noticeIdx}`}>
                            <List
                              {...props}
                              thisMemNo={thisMemNo}
                              isTop={isTop}
                              title={title}
                              contents={contents}
                              writeDt={writeDt}
                              noticeIdx={noticeIdx}
                              numbers={numbers}
                              toggle={toggler}
                            />
                          </a>
                        )}
                      </div>
                    )
                  })}
              </ListWrap>
              <ListWrap>
                {Array.isArray(listPage) ? (
                  listPage.length > 0 ? (
                    listPage.map((list, idx) => {
                      const {isTop, title, contents, writeDt, noticeIdx} = list
                      return (
                        <div key={idx}>
                          {isTop === false && (
                            <a className={`idx${noticeIdx}`}>
                              <List
                                {...props}
                                thisMemNo={thisMemNo}
                                isTop={isTop}
                                title={title}
                                contents={contents}
                                writeDt={writeDt}
                                noticeIdx={noticeIdx}
                                numbers={numbers}
                                toggle={toggler}
                              />
                            </a>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <>
                      <NoResult />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                    </>
                  )
                ) : (
                  <div className="search" />
                )}
              </ListWrap>{' '}
            </>
          )}
        </>
      )}

      <Write className={writeShow && 'on'}>
        <Header click={WriteToggle}>
          <div className="category-text">방송공지</div>
        </Header>
        <section>
          <div className="titleWrite">
            <input placeholder="글의 제목을 입력하세요." maxLength="20" onChange={textChange} value={coment} />
          </div>

          <div className="contentWrite">
            <textarea
              placeholder="작성하고자 하는 글의 내용을 입력해주세요."
              maxLength="189"
              onChange={textChangeContent}
              value={comentContent}
            />
          </div>
          <div className="checkbox-wrap">
            <Checkbox title="상단 고정" fnChange={(v) => setState({click1: v})} checked={state.click1} />
          </div>

          <WriteSubmit className={writeBtnState === true ? 'on' : ''} onClick={() => NoticeUpload()}>
            등록
          </WriteSubmit>
        </section>
      </Write>
    </>
  )
}
const TopHistory = styled.div`
  position: fixed;
  top: 40px;
  left: 0;
  width: 100vw;

  background-color: #fff;
  z-index: 21;
  & header {
    padding: 16px 16px 16px 10px;
    display: flex;

    border-bottom: 1px solid #bdbdbd;
    button:nth-child(1) {
      width: 24px;
      height: 24px;
      background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
    }
    h2 {
      width: calc(100% - 24px);
      font-size: 18px;
      font-weight: 600;
      line-height: 1.17;
      letter-spacing: -0.45px;
      text-align: center;
    }
  }
`

const GlobalWriteBtn = styled.button`
  display: none;

  @media (max-width: ${WIDTH_MOBILE}) {
    display: none;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 12px;
    right: 0px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background-color: #632beb;
    &.on {
      display: flex;
    }

    .inner {
      width: 27px;
      height: 27px;
      background-image: url(${WhitePen});
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
    }
  }
`

const WriteBtn = styled.button`
  position: relative;
  padding: 12px 20px 12px 36px;
  border-radius: 10px;
  border: 1px solid #632beb;
  cursor: pointer;
  font-size: 14px;
  color: #632beb;

  &::after {
    position: absolute;
    top: 12px;
    left: 18px;
    content: '';
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-image: url(${pen});
  }

  &.on {
    color: #fff;
    border-color: #bdbdbd;
    background-color: #bdbdbd;

    &::after {
      background-image: url(${WhitePen});
    }
  }

  @media (max-width: ${WIDTH_MOBILE}) {
    display: none;
  }
`

const ListWrap = styled.div`
  /* width: calc(100% + 32px);
  margin-left: -16px; */
  position: relative;
  .search {
    min-height: 200px;
  }
  a {
    display: block;
    width: 100%;
    height: 100%;
  }

  &.noticeIsTop {
    margin: 12px 0;
  }
  .write-btn {
    color: red;
  }
`

const TopWrap = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${COLOR_MAIN};
  align-items: center;
  margin-top: 24px;
  margin-bottom: 0px;
  padding-bottom: 12px;
  button:nth-child(1) {
    width: 24px;
    height: 24px;
    background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
  }
  .title {
    width: calc(100% - 24px);
    color: ${COLOR_MAIN};
    font-size: 18px;
    font-weight: bold;
    letter-spacing: -0.5px;
    text-align: center;
  }
`

const Write = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #eeeeee;
  z-index: 21;

  .checkbox-wrap > div:first-child {
    margin: 8px 0 32px 0;
  }

  & header {
    padding: 16px 16px 16px 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    button:nth-child(1) {
      width: 24px;
      height: 24px;
      background: url(${IMG_SERVER}/images/api/btn_back.png) no-repeat center center / cover;
    }
    h2 {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.17;
      letter-spacing: -0.45px;
      text-align: center;
    }
  }

  & section {
    padding: 20px 16px 0 16px;
    .titleWrite {
      input {
        padding: 14px 16px;
        height: 44px;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        width: 100%;
        font-size: 14px;
        &:focus {
          border: 1px solid #000;
        }
        &::placeholder {
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: -0.35px;
          text-align: left;
          color: #757575;
        }
      }
    }
    .contentWrite {
      margin-top: 4px;

      textarea {
        font-size: 14px;
        border-radius: 12px;
        &:focus {
          border: 1px solid #000;
        }
        padding: 16px;
        border: 1px solid #e0e0e0;
        width: 100%;
        min-height: 310px;

        color: #000;
        font-size: 16px;
        letter-spacing: -0.8px;
        line-height: 1.5;
        transform: skew(-0.03deg);
        &::placeholder {
          font-size: 14px;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: -0.35px;
          text-align: left;
          color: #757575;
        }
      }
    }
  }
  .WriteSubmit {
  }

  &.on {
    display: block;
  }
`
const WriteSubmit = styled.button`
  display: block;

  width: 100%;
  background-color: #bdbdbd;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  height: 44px;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);
  border-radius: 12px;
  &.on {
    background-color: ${COLOR_MAIN};
  }
`
const TitleBtn = styled.button`
  position: absolute;
  right: 16px;
  font-size: 16px;
  line-height: 1.25;
  letter-spacing: -0.4px;
  text-align: left;
  color: #757575;
  font-weight: bold;
  transform: skew(-0.03deg);

  &.on {
    color: ${COLOR_MAIN};
    font-weight: 600;
  }
`

export default Notice
