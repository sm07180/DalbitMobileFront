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
  const [checkIdx, setCheckIdx] = useState(0)
  //modift msg
  const [modifyMsg, setModifyMsg] = useState('')

  //dateformat
  const timeFormat = (strFormatFromServer) => {
    let date = strFormatFromServer.slice(0, 8)
    date = [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('.')
    let time = strFormatFromServer.slice(8)
    time = [time.slice(0, 2), time.slice(2, 4), time.slice(4)].join(':')
    return `${date} ${time}`
  }
  //토글 모어버튼
  const moreToggle = (boardIdx, contents) => {
    if (thisBigIdx !== 0) {
      setThisBigIdx(0)
    } else {
      setThisBigIdx(boardIdx)
    }
  }
  //수정하기 토글
  const editToggle = (contents, boardIdx) => {
    if (writeState === false) {
      setWriteState(true)
      setThisBigIdx(0)
      setCheckIdx(boardIdx)
      setModifyMsg(contents)
    } else {
      setWriteState(false)
    }
  }
  //수정하기 fetch
  async function editBoard() {
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
    }
  }
  //삭제하기 fetch
  const deleteBoard = (boardIdx) => {
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
        props.set(true)
      } else if (res.result === 'fail') {
        context.action.alert({
          callback: () => {},
          msg: res.message
        })
      }
    }
    fetchDataDelete()
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
            <button className="btn__more" onClick={() => moreToggle(props.data.boardIdx, props.data.contents)}></button>

            <div className={props.data.boardIdx === thisBigIdx ? 'moreList on' : 'moreList'}>
              {/* {props.data.writerNo === context.token.memNo && (
                <button onClick={() => editToggle(props.data.contents, props.data.boardIdx)}>수정하기</button>
              )} */}
              <button onClick={() => deleteBoard(props.data.boardIdx)}>삭제하기</button>
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
