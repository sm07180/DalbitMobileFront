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
// image,color
import pen from 'images/pen.svg'
import WhitePen from '../component/images/WhitePen.svg'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {IMG_SERVER, WIDTH_MOBILE} from 'context/config'

const Notice = props => {
  //context
  const ctx = useContext(Context)
  const context = useContext(Context)
  //memNo
  const urlrStr = props.location.pathname.split('/')[2]
  //state
  const [writeStatus, setWriteStatus] = useState('off')
  const [listDetailed, setListDetailed] = useState('search')
  const [totalPageNumber, setTotalPageNumber] = useState(null)
  const [page, setPage] = useState(1)
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
  //공지제목 등록 온체인지
  const textChange = e => {
    const target = e.currentTarget
    if (target.value.length > 20) return
    setComment(target.value)
  }
  //공지컨텐트 등록 온체인지
  const textChangeContent = e => {
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
        context.action.confirm({
          callback: () => {
            setWriteShow(false)
            window.location.reload()
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
    if (writeShow === false) {
      setWriteShow(true)
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
  useEffect(() => {
    ;(async () => {
      const params = {
        memNo: urlrStr,
        page,
        records: 10
      }
      const response = await Api.mypage_notice_inquire(params)
      if (response.result === 'success') {
        const {list, paging} = response.data
        if (paging) {
          const {totalPage} = paging
          setTotalPageNumber(totalPage)
        }
        setListDetailed(list)
        //console.log(response)
      } else {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    })()
  }, [page])

  //-----------------------------------------------------------------------
  //토글
  const [numbers, setNumbers] = useState('')

  const toggler = noticeIdx => {
    if (numbers === noticeIdx) {
      setNumbers('')
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
        <div className="category-text">방송국 공지</div>
      </Header>
      <ListWrap>
        {Array.isArray(listDetailed) ? (
          listDetailed.length > 0 ? (
            listDetailed.map((list, idx) => {
              const {isTop, title, contents, writeDt, noticeIdx} = list
              return (
                <a key={idx} className={`idx${noticeIdx}`}>
                  <List
                    {...props}
                    isTop={isTop}
                    title={title}
                    contents={contents}
                    writeDt={writeDt}
                    noticeIdx={noticeIdx}
                    numbers={numbers}
                    toggle={toggler}
                  />
                </a>
              )
            })
          ) : (
            <>
              <NoResult />
              <br />
              <br />
              <br />
            </>
          )
        ) : (
          <div className="search" />
        )}
      </ListWrap>
      {/* {listDetailed !== 'search' && <Paging setPage={setPage} totalPage={totalPageNumber} currentPage={page} />} */}
      {Array.isArray(listDetailed) && listDetailed.length > 0 && listDetailed !== 'search' && (
        <Paging setPage={setPage} totalPage={totalPageNumber} currentPage={page} />
      )}

      <GlobalWriteBtn onClick={() => WriteToggle()} className={urlrStr === ctx.profile.memNo ? 'on' : ''}>
        <div className="inner" />
      </GlobalWriteBtn>

      <Write className={writeShow && 'on'}>
        <header>
          <button onClick={() => setWriteShow(false)}></button>
          <h2>공지 작성하기</h2>
          <TitleBtn className={writeBtnState === true ? 'on' : ''} onClick={() => NoticeUpload()}>
            등록
          </TitleBtn>
        </header>
        <section>
          <div className="titleWrite">
            <input placeholder="글의 제목을 입력하세요." maxLength="20" onChange={textChange} />
          </div>

          <div className="contentWrite">
            <textarea placeholder="작성하고자 하는 글의 내용을 입력해주세요." maxLength="189" onChange={textChangeContent} />
          </div>
          <Checkbox title="고정 공지사항" fnChange={v => setState({click1: v})} checked={state.click1} />
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

    border-bottom: 1px solid #e0e0e0;
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
    position: fixed;
    bottom: 22px;
    right: 50px;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background-color: #8556f6;
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
  border: 1px solid #8556f6;
  cursor: pointer;
  font-size: 14px;
  color: #8556f6;

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
  .search {
    min-height: 200px;
  }
  a {
    display: block;
    width: 100%;
    height: 100%;
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
  background-color: #fff;
  z-index: 21;

  & header {
    padding: 16px 16px 16px 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e0e0e0;
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
    padding: 32px 16px 0 16px;
    .titleWrite {
      input {
        padding: 16px;
        border: 1px solid #e0e0e0;
        width: 100%;
        &:focus {
          border: 1px solid ${COLOR_MAIN};
        }
        &::placeholder {
          color: #616161;
          font-size: 16px;
          line-height: 1.5;
          transform: skew(-0.03deg);
        }
      }
    }
    .contentWrite {
      margin-top: 20px;

      textarea {
        &:focus {
          border: 1px solid ${COLOR_MAIN};
        }
        padding: 16px;
        border: 1px solid #e0e0e0;
        width: 100%;
        min-height: 310px;

        color: #616161;
        font-size: 16px;
        letter-spacing: -0.8px;
        line-height: 1.5;
        transform: skew(-0.03deg);
        &::placeholder {
          color: #616161;
          font-size: 16px;
          letter-spacing: -0.88px;
          line-height: 1.5;
          transform: skew(-0.03deg);
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
  padding: 16px 0;
  width: 100%;
  background-color: #bdbdbd;
  font-size: 16px;
  color: #fff;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.4px;
  transform: skew(-0.03deg);

  &.on {
    background-color: ${COLOR_MAIN};
  }
`
const TitleBtn = styled.button`
  font-size: 16px;
  line-height: 1.25;
  letter-spacing: -0.4px;
  text-align: left;
  color: #9e9e9e;
  transform: skew(-0.03deg);

  &.on {
    color: ${COLOR_MAIN};
    font-weight: 600;
  }
`

export default Notice
