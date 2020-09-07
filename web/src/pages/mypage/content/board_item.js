/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */

import React, {useEffect, useState, useContext, useRef} from 'react'
// modules
import qs from 'query-string'
import {useLocation, useHistory} from 'react-router-dom'
// context
import {Context} from 'context'
import Api from 'context/api'

export default (props) => {
  const history = useHistory()
  let location = useLocation()
  const context = useContext(Context)
  var urlrStr = location.pathname.split('/')[2]
  const {webview} = qs.parse(location.search)

  //state
  const [thisBigIdx, setThisBigIdx] = useState(0)
  const [writeState, setWriteState] = useState(false)
  const [ReplyWriteState, setReplyWriteState] = useState(false)
  const [checkIdx, setCheckIdx] = useState(0)
  const [isScreet, setIsScreet] = useState(false)
  //modift msg
  const [modifyMsg, setModifyMsg] = useState('')
  const [textChange, setTextChange] = useState('')

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
    //setTitleReplyInfo(item)
    if (context.fanboardReplyNum === boardIdx) {
      context.action.updateFanboardReplyNum(-1)
    } else {
      context.action.updateFanboardReplyNum(boardIdx)
    }
    context.action.updateFanboardReply(item)
    context.action.updateToggleAction(true)
    // window.scrollTo({top: 0, left: 0, behavior: 'auto'})
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
    }
  }

  const Link = () => {
    if (webview) {
      context.token.memNo !== props.data.writerNo
        ? history.push(`/mypage/${props.data.writerNo}?webview=${webview}`)
        : history.push(`/menu/profile`)
    } else {
      context.token.memNo !== props.data.writerNo ? history.push(`/mypage/${props.data.writerNo}`) : history.push(`/menu/profile`)
    }
  }

  return (
    <>
      <div className="list-item__header">
        {(urlrStr === context.token.memNo || props.data.writerNo === context.token.memNo) && (
          <>
            <button className="btn__more" onClick={() => toggleMore(props.data.boardIdx, props.data.contents)}></button>
            {/* 상세기능영역 */}

            <div className={props.data.boardIdx === thisBigIdx ? 'moreList on' : 'moreList'}>
              {props.data.writerNo === context.token.memNo && (
                <span onClick={() => BigModify(props.data.contents, props.data.boardIdx)}>수정하기</span>
              )}
              <span onClick={() => DeleteBigReply(props.data.boardIdx)}>삭제하기</span>
            </div>
          </>
        )}
        <span className="thumb" style={{backgroundImage: `url(${props.data.profImg.thumb190x190})`}} onClick={Link}></span>
        <span className="info" onClick={Link}>
          <span className="info__name">
            <em className={`${props.data.viewOn === 0 && 'info__lock'}`}></em>
            {props.data.nickNm}
          </span>
          <span className="info__dt">{timeFormat(props.data.writeDt)}</span>
        </span>
      </div>
      <div className="list-item__content">
        <pre>{props.data.contents}</pre>
      </div>
    </>
  )
}
