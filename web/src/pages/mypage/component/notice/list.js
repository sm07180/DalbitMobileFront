import React, {useState, useEffect, useReducer, useContext} from 'react'
import styled from 'styled-components'

import {Context} from 'context'
import Api from 'context/api'
// image
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import {WIDTH_MOBILE, IMG_SERVER} from 'context/config'
import arrowDownImg from '../images/NoticeArrowDown.svg'
//component
import Checkbox from '../../content/checkbox'

const List = props => {
  //context

  const context = useContext(Context)
  const ctx = useContext(Context)
  var urlrStr = props.location.pathname.split('/')[2]
  //props
  const {isTop, title, contents, writeDt, noticeIdx, numbers} = props
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
          memNo: urlrStr,
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
            window.location.reload()
          },
          msg: res.message
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
          memNo: urlrStr,
          noticeIdx: noticeIdx
        }
      })
      if (res.result === 'success') {
        window.location.reload()
      } else if (res.result === 'fail') {
      }
    }
    context.action.confirm({
      callback: () => {
        fetcNoticeDelete()
      },
      msg: '<em className="brown">게시글을 삭제하시겠습니까?</em>'
    })
  }
  //func
  //dateFormat
  const timeFormat = strFormatFromServer => {
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
  const textChangeContent = e => {
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

  //-------------------------------------------------------------------------
  return (
    <Wrap>
      <ListStyled
        className={numbers === noticeIdx && opened ? 'on' : ''}
        onClick={() => {
          props.toggle(noticeIdx)
        }}>
        <TitleWrap className={isTop ? 'is-top' : ''}>
          {isTop && <em></em>}
          <span className="text">{title}</span>
        </TitleWrap>

        <ArrowDownBtn className={numbers === noticeIdx && opened ? 'on' : ''} />
      </ListStyled>
      {numbers === noticeIdx && opened && (
        <>
          <ListContent>
            <div>{title}</div>
            <div> {timeFormat(writeDt)}</div>
            <div>
              <pre>{contents}</pre>
            </div>
          </ListContent>
          <Buttons className={urlrStr === ctx.profile.memNo ? 'on' : ''}>
            <button onClick={WriteToggle}>
              <i className="far fa-edit"></i>수정
            </button>
            <button onClick={NoticeDelete}>
              <i className="far fa-trash-alt"></i>
              삭제
            </button>
          </Buttons>

          <Write className={writeShow && 'on'}>
            <header>
              <button onClick={modifyBtn}></button>
              <h2>공지 수정하기</h2>
              <TitleBtn className={writeBtnState === true ? 'on' : ''} onClick={() => NoticeUpload()}>
                수정
              </TitleBtn>
            </header>
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
              <Checkbox title="고정 공지사항" fnChange={v => setState({click1: v})} checked={state.click1} />
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
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${arrowDownImg});
  &.on {
    background-image: url(${IMG_SERVER}/images/api/ic_chevron_sm_up.png);
  }
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
  flex-direction: row;
  align-items: center;
  color: #424242;
  font-size: 14px;
  transform: skew(-0.03deg);
  margin-left: 4px;
  > em {
    display: block;
    width: 20px;
    height: 20px;
    background: url(${IMG_SERVER}/images/api/ic_thumbtack.png) no-repeat center center / cover;
  }
  > i {
    display: none;
  }

  &.is-top {
    color: #8556f6;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.35px;
    > i {
      display: block;
    }
  }
  .text {
    margin-left: 4px;
  }
`

const ListContent = styled.div`
  padding: 24px 18px;
  background-color: #f8f8f8;
  color: #616161;
  font-size: 14px;
  letter-spacing: -0.35px;
  div:nth-child(1) {
    color: #000000;
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: -0.4px;
    transform: skew(-0.03deg);
  }
  div:nth-child(2) {
    margin-top: 6px;
    font-size: 12px;
    color: #bdbdbd;
    line-height: 1.08;
    letter-spacing: -0.3px;
    transform: skew(-0.03deg);
  }
  div:nth-child(3) {
    margin-top: 16px;
    font-size: 14px;
    line-height: 1.43;
    letter-spacing: -0.35px;
    transform: skew(-0.03deg);
    overflow-wrap: break-word;
  }
`

const ListStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 47px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  user-select: none;

  &.on {
    background-color: #f8f8f8;
  }

  &:active {
    background-color: #efefef;
  }
`
const Buttons = styled.div`
  display: none;
  justify-content: flex-end;
  background-color: #f8f8f8;
  border-top: 1px solid #efefef;
  border-bottom: 1px solid #efefef;
  & button {
    padding: 12px 20px 12px 20px;
    font-size: 14px;
    line-height: 1.43;
    letter-spacing: -0.35px;
    text-align: left;
    color: #9e9e9e;
    transform: skew(-0.03deg);
    > i {
      display: inline-block;
      padding-right: 5px;
      font-size: 14px;
      color: #bdbdbd;
    }
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
      line-height: 24px;
      letter-spacing: -0.45px;
      text-align: center;
    }

    .submit {
      font-size: 16px;
      line-height: 1.25;
      letter-spacing: -0.4px;
      text-align: left;
      color: #9e9e9e;
      transform: skew(-0.03deg);
    }
  }

  & section {
    padding: 32px 16px 0 16px;
    .titleWrite {
      input {
        width: 100%;
        padding: 16px;
        border: 1px solid #e0e0e0;
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
const Wrap = styled.div`
  position: relative;
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
