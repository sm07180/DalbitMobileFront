import React, {useState, useEffect, useReducer, useContext} from 'react'
import styled from 'styled-components'
import {Context} from 'context'
import Api from 'context/api'
//router
import {useHistory, useLocation} from 'react-router-dom'

// image
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {WIDTH_MOBILE, IMG_SERVER} from 'context/config'
//component
import Checkbox from '../../content/checkbox'
import closeBtn from '../../component/ic_back.svg'
import NewIcon from '../../static/newIcon.svg'
import Header from '../header.js'
import ArrowRight from '../../component/arrow_right.svg'
import BookMark from '../../component/book_mark_red.svg'
const List = (props) => {
  //context
  const context = useContext(Context)
  const ctx = useContext(Context)
  let history = useHistory()
  let location = useLocation()
  let yourMemNo
  if (props.location) {
    yourMemNo = props.location.pathname.split('/')[2]
  } else {
    yourMemNo = location.pathname.split('/')[2]
  }
  //props
  const {isTop, title, contents, writeDt, noticeIdx, numbers, nickNm, profImg, writeTs} = props

  const initialState = {
    click1: isTop
  }
  //state
  const [opened, setOpened] = useState(false)
  const reducer = (state, action) => ({...state, ...action})
  const [state, setState] = useReducer(reducer, initialState)
  const [coment, setComment] = useState(title)
  const [comentContent, setCommentContent] = useState(contents)
  const [writeShow, setWriteShow] = useState(false)
  const [writeBtnState, setWriteBtnState] = useState(false)
  //---------------------------------------------------------------------
  //api
  const NoticeUpload = () => {
    async function fetcNoticeUpload() {
      const res = await Api.mypage_notice_edit({
        data: {
          memNo: yourMemNo,
          noticeIdx: noticeIdx,
          title: coment,
          contents: comentContent,
          isTop: state.click1
        }
      })
      if (res.result === 'success') {
        context.action.alert({
          callback: () => {
            setWriteShow(false)
            context.action.updateNoticeState(true)
          },
          msg: res.message
        })
      } else if (res.result === 'fail') {
        context.action.alert({
          msg: res.message
        })
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
        //console.log(res)
      }
    }
    if (writeBtnState === true) {
      fetcNoticeUpload()
    }
  }
  const NoticeDelete = () => {
    async function fetcNoticeDelete() {
      const res = await Api.mypage_notice_delete({
        data: {
          memNo: yourMemNo,
          noticeIdx: noticeIdx
        }
      })
      if (res.result === 'success') {
        context.action.updateNoticeState(true)
      } else if (res.result === 'fail') {
        context.action.alert({
          msg: res.message
        })
      }
    }
    context.action.confirm({
      callback: () => {
        fetcNoticeDelete()
      },
      msg: '게시글을 삭제하시겠습니까?'
    })
  }
  //func
  //dateFormat
  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }
  //open toggler

  //alertfunc
  const modifyBtn = () => {
    context.action.confirm({
      callback: () => {
        setWriteShow(false)
      },
      msg: '현재 작성 중인 게시글은 저장되지 않습니다.<br /><b>취소하시겠습니까?</b>'
    })
  }
  const WriteToggle = () => {
    if (writeShow === false) {
      setWriteShow(true)
    } else {
      setWriteShow(false)
    }
  }
  //active
  const WritBtnActive = () => {
    if (coment !== '' && comentContent !== '') {
      setWriteBtnState(true)
    } else {
      setWriteBtnState(false)
    }
  }
  //공지제목 등록 온체인지
  const textChange = (e, title) => {
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
  //-------------------------------------------------------------------------
  useEffect(() => {
    setOpened(false)
  }, [title])
  //------------------------------------------------------------------------
  useEffect(() => {
    WritBtnActive()
  }, [coment, comentContent])
  /////////////////////////////////////////////////////////////
  useEffect(() => {
    if (numbers === noticeIdx) {
      setOpened(true)
    } else {
      setOpened(false)
    }
  }, [numbers])
  //time
  const timestamp = String(new Date().getTime()).substr(0, 10)
  const IntTime = parseInt(timestamp)
  //transfer memNo
  const historyMem = (yourMemNo) => {
    if (yourMemNo !== context.profile.memNo) {
      history.push(`/profile/${yourMemNo}`)
    } else if (yourMemNo !== context.profile.memNo) return false
  }
  //-------------------------------------------------------------------------
  return (
    <Wrap>
      <ListStyled
        className={numbers === noticeIdx && opened ? 'on' : ''}
        onClick={() => {
          props.toggle(noticeIdx)
        }}>
        <TitleWrap className={isTop ? 'is-top' : ''}>
          {/* {isTop && <em></em>} */}
          <span className="text">{title}</span>
          <span className="date">{timeFormat(writeDt)}</span>
          {(IntTime - writeTs) / 3600 < 7 && <span className="newIcon"></span>}
        </TitleWrap>
        {isTop === true && <ArrowDownBtnTop className={numbers === noticeIdx && opened ? 'on' : ''} />}
        {isTop === false && <ArrowDownBtn className={numbers === noticeIdx && opened ? 'on' : ''} />}
      </ListStyled>
      {numbers === noticeIdx && opened && (
        <>
          <ListContent>
            <div className="detail_header">
              <button onClick={() => setOpened(false)}></button>
              방송공지
            </div>
            <div className="detail_header_info">
              <div className="detail_date">
                <div>{title}</div>
                <div>{timeFormat(writeDt)}</div>
              </div>
            </div>
            <div className="detail_header_writerinfo">
              <div className="detail_info">
                {profImg && <img src={profImg.thumb80x80} onClick={() => historyMem(yourMemNo)} />}
                {nickNm && <span className="nick">{nickNm}</span>}
              </div>
            </div>
            <div className="detail_contents">
              <pre>{contents}</pre>
            </div>
            <Buttons className={yourMemNo === ctx.profile.memNo ? 'on' : ''}>
              <button onClick={WriteToggle}>
                {/* <em></em> */}
                수정
              </button>
              <button onClick={NoticeDelete}>
                {/* <em className="delete_icon"></em> */}
                삭제
              </button>
            </Buttons>
          </ListContent>

          <Write className={writeShow && 'on'}>
            <Header click={WriteToggle} title="공지 수정하기">
              {/* <div className="category-text">공지 수정하기</div> */}
              {/* <TitleBtn className={writeBtnState === true ? 'on' : ''} onClick={() => NoticeUpload()}>
                수정
              </TitleBtn> */}
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
                수정
              </WriteSubmit>
            </section>
          </Write>
        </>
      )}
    </Wrap>
  )
}

export default List

const ArrowDownBtn = styled.button`
  width: 36px;
  height: 36px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${ArrowRight});
`

const ArrowDownBtnTop = styled.button`
  width: 36px;
  height: 36px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${BookMark});
`

const Time = styled.div`
  font-size: 12px;
  letter-spacing: -0.3px;
  color: #bdbdbd;
  margin-right: 6px;

  @media (max-width: ${WIDTH_MOBILE}) {
    display: none;
  }
`

const TimeWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  color: #424242;
  font-size: 16px;
  padding: 0 0 0 16px;
  transform: skew(-0.03deg);
  font-weight: 600;
  > em {
    display: block;
    width: 20px;
    height: 20px;
    background: url(${IMG_SERVER}/images/api/ic_thumbtack.svg) no-repeat center center / cover;
  }
  > i {
    display: none;
  }
  &.is-top {
    color: #632beb;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.35px;
    > i {
      display: block;
    }
  }
  .text {
    font-size: 16px;
    font-weight: 800;
    line-height: 1.14;
    letter-spacing: normal;
    text-align: left;
    letter-spacing: -0.35px;
    color: #000000;
  }
  .date {
    margin-top: 4px;
    font-size: 12px;
    font-weight: normal;
    color: #757575;
  }
`

const ListContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  z-index: 5;
  /* padding: 20px 16px; */
  background-color: #eee;
  color: #424242;
  font-size: 14px;
  letter-spacing: -0.35px;
  .detail_header {
    position: relative;
    width: 100%;
    height: 50px;
    padding: 12px 16px;
    text-align: center;
    font-size: 18px;
    font-weight: 800;
    color: #000;
    background-color: #fff;
    border-bottom: 1px solid #d2d2d2;
    box-sizing: border-box;
    button {
      position: absolute;
      left: 6px;
      top: 50%;
      transform: translateY(-50%);
      display: block;
      width: 40px;
      height: 40px;
      background: url(${closeBtn}) no-repeat center center / cover;
    }
  }

  .detail_header_info {
    background-color: #fff;
    margin-top: 12px !important;
    border-bottom: 1px solid #eeeeee;
    .detail_date {
      padding: 10px 16px 10px 16px;
      > div {
        height: 20px;
        line-height: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      div:nth-child(1) {
        font-size: 18px;
        font-weight: 800;
        text-align: left;
        color: #000;
      }
      div:nth-child(2) {
        font-size: 12px;
        color: #757575;
      }
    }
  }
  .detail_header_writerinfo {
    background-color: #fff;
    border-bottom: 1px solid #eeeeee;
    .detail_info {
      display: flex;
      align-items: center;
      padding: 8px 16px 8px 16px;
      .nick {
        margin-left: 10px;
        font-size: 16px;
        font-weight: 800;
        text-align: left;
        color: #000000;
      }
      > img {
        width: 40px;
        border-radius: 50%;
        height: 40px;
      }
    }
  }
`

const ListStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  user-select: none;
  background-color: #fff;

  &.on {
    background-color: #f8f8f8;
  }

  &:active {
    background-color: #efefef;
  }
`
const Buttons = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  margin-top: 32px;

  & button {
    position: relative;
    width: 162px;
    height: 44px;
    font-size: 16px;
    font-weight: 600;
    line-height: 44px;
    border-radius: 12px;
    letter-spacing: -0.35px;
    color: #fff;
    background-color: #757575;
    transform: skew(-0.03deg);
  }
  button:last-child {
    margin-left: 4px;
  }
  & button + button ::before {
    display: block;
    position: absolute;
    left: 0;
    top: 14px;
    width: 1px;
    height: 16px;
    background: #e0e0e0;
    content: '';
  }
  &.on {
    display: flex;
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
    margin: 8px 0 18px 0;
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
    background-color: #eeeeee;
    padding: 20px 16px 0 16px;
    .titleWrite {
      input {
        height: 44px;
        padding: 14px 16px;
        border: solid 1px #e0e0e0;
        border-radius: 12px;
        width: 100%;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        color: #000000;
        &:focus {
          border: 1px solid #000;
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
      margin-top: 12px;

      textarea {
        &:focus {
          border: 1px solid #000;
        }
        padding: 17px 24px 17px 16px;
        border: solid 1px #e0e0e0;
        width: 100%;
        min-height: 310px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        color: #000000;
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
  padding: 13px 0;
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
const Wrap = styled.div`
  position: relative;
  .detail_contents {
    margin-top: 0;
    min-height: 200px;
    padding: 10px 16px 21px 16px;
    background-color: #fff;
    word-break: break-all;
  }

  .newIcon {
    display: inline-block;
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -12px;
    width: 24px;
    height: 24px;
    margin-left: 8px;
    background-position: center center;
    background-size: cover;
    background-image: url(${NewIcon});
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
