/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */

import React, {useEffect, useState, useContext, useRef} from 'react'
// modules
import qs from 'query-string'
import styled from 'styled-components'
import {useLocation, useHistory} from 'react-router-dom'
// context
import {Context} from 'context'
import {WIDTH_PC, WIDTH_TABLET, IMG_SERVER} from 'context/config'
import {COLOR_MAIN, COLOR_POINT_Y, COLOR_POINT_P, PHOTO_SERVER} from 'context/color'
import Api from 'context/api'
// component
import Header from '../component/header.js'
import ReplyList from './fanBoard_reply'
import DalbitCheckbox from 'components/ui/dalbit_checkbox'
//svg
import BJicon from '../component/bj.svg'
import ReplyIcon from '../static/ic_reply_purple.svg'
import BackIcon from '../component/ic_back.svg'
import MoreBtnIcon from '../static/ic_new_more.svg'
import LockIcon from '../static/lock_g.svg'
//--------------------------------------------------------------------------
export default (props) => {
  // context && location
  const history = useHistory()
  let location = useLocation()
  const context = useContext(Context)
  var urlrStr = location.pathname.split('/')[2]
  const {webview} = qs.parse(location.search)
  //전체 댓글리스트(props)
  const TotalList = props.list
  const TotalCount = props.totalCount
  //state
  const [thisBigIdx, setThisBigIdx] = useState(0)
  const [writeState, setWriteState] = useState(false)
  const [ReplyWriteState, setReplyWriteState] = useState(false)
  const [checkIdx, setCheckIdx] = useState(0)
  const [replyShowIdx, setReplyShowIdx] = useState(false)
  const [titleReplyInfo, setTitleReplyInfo] = useState('')
  const [isScreet, setIsScreet] = useState(false)
  const [donstChange, setDonstChange] = useState(false)
  //modift msg
  const [modifyMsg, setModifyMsg] = useState('')
  const [textChange, setTextChange] = useState('')

  //--------------------------function
  //dateformat
  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }
  //토글 모어버튼
  const toggleMore = (boardIdx, contents) => {
    setThisBigIdx(boardIdx)
  }
  //수정하기 토글
  const BigModify = (contents, boardIdx) => {
    if (writeState === false) {
      setWriteState(true)
      setThisBigIdx(0)
      setCheckIdx(boardIdx)
      setModifyMsg(contents)
    } else {
      setWriteState(false)
    }
  }
  //정보 대댓글로 전달
  const ReplyInfoTransfer = (boardIdx, item) => {
    setReplyShowIdx(boardIdx)
    //setTitleReplyInfo(item)
    context.action.updateFanboardReplyNum(boardIdx)
    context.action.updateFanboardReply(item)
    context.action.updateToggleAction(true)
    window.scrollTo({top: 0, left: 0, behavior: 'auto'})
  }
  //댓글 등록 온체인지
  const BigChangeContent = (e) => {
    const target = e.currentTarget
    if (target.value.length > 100) return
    setModifyMsg(target.value)
  }
  //대댓글 작성 및 초기화
  const ReplyWrite = (boardIdx, viewOn) => {
    if (viewOn === 0) {
      setIsScreet(true)
      setDonstChange(true)
    } else {
      setIsScreet(false)
      setDonstChange(false)
    }
    if (ReplyWriteState === false) {
      context.action.updateReplyIdx(boardIdx)
      setReplyWriteState(true)
    } else {
      setTextChange('')
      setReplyWriteState(false)
    }
  }
  //댓글 온체인지
  const handleChangeBig = (e) => {
    const target = e.currentTarget
    if (target.value.length > 100) return
    setTextChange(target.value)
  }
  //수정하기 fetch
  async function fetchDataModiy() {
    const res = await Api.mypage_board_edit({
      data: {
        memNo: urlrStr,
        boardIdx: checkIdx,
        content: modifyMsg
      }
    })
    if (res.result === 'success') {
      setWriteState(false)
      setModifyMsg('')
      context.action.updateFanBoardBigIdxMsg(modifyMsg)
    } else if (res.result === 'fail') {
      if (modifyMsg.length === 0) {
        context.action.alert({
          callback: () => {},
          msg: '수정 내용을 입력해주세요.'
        })
      }
      // context.action.alert({
      //   cancelCallback: () => {},
      //   msg: res.message
      // })
    }
  }
  //삭제하기 fetch
  const DeleteBigReply = (boardIdx) => {
    async function fetchDataDelete() {
      const res = await Api.mypage_fanboard_delete({
        data: {
          memNo: urlrStr,
          boardIdx: boardIdx
        }
      })
      if (res.result === 'success') {
        context.action.updateFanBoardBigIdxMsg(boardIdx)
        setThisBigIdx(0)
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataDelete()
  }
  //대댓글 추가
  async function fetchDataUploadReply() {
    const res = await Api.mypage_fanboard_upload({
      data: {
        memNo: urlrStr,
        depth: 2,
        content: textChange,
        boardNo: context.replyIdx,
        viewOn: isScreet === true ? 0 : 1
      }
    })
    if (res.result === 'success') {
      context.action.updateReplyIdx(false)
      setTextChange('')
      context.action.updateFanBoardBigIdxMsg(textChange)
      setReplyWriteState(false)
    } else if (res.result === 'fail') {
      if (textChange.length === 0) {
        context.action.alert({
          callback: () => {},
          msg: '답글 내용을 입력해주세요.'
        })
      }
      // context.action.alert({
      //   callback: () => {},
      //   msg: res.message
      // })
    }
  }

  //--------------------------------------------------------------------------
  return (
    <>
      {/* 딤영역 */}
      {thisBigIdx !== 0 && <Dim onClick={() => setThisBigIdx(0)} />}
      <Content>
        <div className={`list-wrap ${context.toggleState === false ? 'on' : 'off'}`}>
          {TotalCount && (
            <div className="big_count">
              <span>게시글</span>
              <span>{TotalCount}</span>
            </div>
          )}
          {TotalList &&
            TotalList !== false &&
            TotalList.map((item, index) => {
              const {nickNm, writerNo, contents, writeDt, profImg, replyCnt, boardIdx, viewOn} = item
              const Link = () => {
                if (webview) {
                  context.token.memNo !== writerNo
                    ? history.push(`/mypage/${writerNo}?webview=${webview}`)
                    : history.push(`/menu/profile`)
                } else {
                  context.token.memNo !== writerNo ? history.push(`/mypage/${writerNo}`) : history.push(`/menu/profile`)
                }
              }
              return (
                <BigReply key={index}>
                  <div className="reply_header">
                    {(urlrStr === context.token.memNo || writerNo === context.token.memNo) && (
                      <>
                        <button className="big_moreBtn" onClick={() => toggleMore(boardIdx, contents)}></button>
                        {/* 상세기능영역 */}

                        <div className={boardIdx === thisBigIdx ? 'big_moreDetail on' : 'big_moreDetail'}>
                          {writerNo === context.token.memNo && (
                            <span onClick={() => BigModify(contents, boardIdx)}>수정하기</span>
                          )}
                          <span onClick={() => DeleteBigReply(boardIdx)}>삭제하기</span>
                        </div>
                      </>
                    )}

                    <BigProfileImg bg={profImg.thumb62x62} onClick={Link} />
                    <div className="big_header_info">
                      <span onClick={Link}>
                        <div>
                          <span className={`${viewOn === 0 && 'big_header_info__lock'}`}></span>
                          <span className="big_header_info__name">{nickNm}</span>
                        </div>
                        <div className="big_header_info__dt">{timeFormat(writeDt)}</div>
                      </span>
                    </div>
                  </div>
                  <div className="content_area">
                    <pre>{contents}</pre>
                  </div>
                  <div className="big_footer">
                    <button onClick={() => ReplyInfoTransfer(boardIdx, item)}>{replyCnt}</button>
                    <a onClick={() => ReplyWrite(boardIdx, viewOn)}>답글쓰기</a>
                  </div>
                </BigReply>
              )
            })}
          {/* 큰댓글 수정하기영역 */}
          {writeState && (
            <Writer>
              <header>
                <button onClick={() => setWriteState(false)}></button>
                <span>팬보드 수정</span>
              </header>
              <div className="content_area">
                <Textarea value={modifyMsg} onChange={BigChangeContent} placeholder="내용을 입력해주세요" />
                <span className="bigCount">
                  <em>{modifyMsg.length}</em> / 100
                </span>
                <button onClick={() => fetchDataModiy()}>수정</button>
              </div>
            </Writer>
          )}
          {/* 대댓글 작성영역 */}
          {ReplyWriteState && (
            <Writer>
              <header>
                <button onClick={() => ReplyWrite(false)}></button>
                <span>답글 쓰기</span>
              </header>

              <div className="content_area">
                <Textarea placeholder="내용을 입력해주세요" onChange={handleChangeBig} value={textChange} />
                <span className="bigCount">
                  <span className="bigCount__screet">
                    <DalbitCheckbox
                      status={isScreet}
                      callback={() => {
                        if (!setDonstChange) {
                          setIsScreet(!isScreet)
                        }
                      }}
                    />
                    <span className="bold">비공개</span>
                  </span>
                  <span>
                    <em>{textChange.length}</em> / 100
                  </span>
                </span>
                <button onClick={() => fetchDataUploadReply()}>등록</button>
              </div>
            </Writer>
          )}
        </div>
        {/*대댓글 리스트영역*/}
        {context.fanboardReplyNum && context.toggleState && (
          <ReplyList replyShowIdx={context.fanboardReplyNum} titleReplyInfo={context.fanboardReply} />
        )}
      </Content>
    </>
  )
}
// style

const BigReply = styled.div`
  width: 100%;
  background-color: #fff;
  /* min-height: 196px; */
  margin-bottom: 12px;
  .detailwapper {
    position: relative;
  }
  .reply_header {
    position: relative;
    display: flex;
    padding: 10px 16px;
    height: 60px;
    .big_moreBtn {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      background: url(${MoreBtnIcon}) no-repeat center center / cover;
    }
    .big_moreDetail {
      display: none;
      flex-direction: column;
      position: absolute;
      right: 24px;
      top: 46px;

      width: 80px;
      border: 1px solid #e0e0e0;
      background-color: #fff;
      padding: 8px 0;
      span {
        height: 26px;
        font-size: 14px;
        line-height: 2.14;
        letter-spacing: -0.35px;
        text-align: center;
        color: #757575;
        :hover {
          background-color: #f8f8f8;
        }
      }
      &.on {
        display: flex;
        z-index: 56;
      }
    }
  }
  .big_header_info {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    &__name {
      height: 20px;
      line-height: 20px;
      max-width: 200px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow-x: hidden;
      font-size: 16px;
      font-weight: 800;
      text-align: left;
      color: #000000;
    }
    &__dt {
      margin-top: 4px;
      font-size: 12px;
      text-align: left;
      color: #9e9e9e;
    }

    &__lock {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url(${LockIcon}) no-repeat center;
    }
  }
  .content_area {
    padding: 16px 65px 16px 21px;
    /* min-height: 100px; */
    border-top: 1px solid #eeeeee;
    border-bottom: 1px solid #eeeeee;

    font-size: 14px;
    text-align: justify;
    color: #000000;

    word-break: break-word;
  }
  .big_footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 36px;
    padding: 0 16px;
    > button {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
      :before {
        display: block;
        content: '';
        width: 16px;
        height: 16px;
        margin-right: 6px;
        background: url(${ReplyIcon}) no-repeat center center / cover;
      }
    }
    > a {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: left;
      color: #632beb;
    }
  }
`
const BigProfileImg = styled.div`
  width: 40px;
  height: 40px;
  background: url(${(props) => props.bg}) no-repeat center center / cover;
  border-radius: 50%;
`
//최상단

const Content = styled.div`
  height: 100%;
  background-color: #eeeeee;

  .list-wrap {
    &.on {
      display: block;
    }
    &.off {
      display: none;
    }
  }
  .big_count {
    padding-left: 16px;
    margin: 16px 0 8px 0;
    span:first-child {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
      margin-right: 6px;
    }
    span:last-child {
      font-size: 16px;
      font-weight: 600;
      letter-spacing: normal;
      text-align: left;
      color: #632beb;
    }
  }
`
const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 55;
`
//수정하기

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
      margin-bottom: 32px;
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
