/**
 * @file /mypage/content/fan-board.js
 * @brief 마이페이지 팬보드2.5v
 */

import React, {useEffect, useState, useContext, useRef} from 'react'
// modules
import qs from 'query-string'
import {useLocation, useHistory, useParams} from 'react-router-dom'
// context
import {Context} from 'context'
import Api from 'context/api'
import {Hybrid} from 'context/hybrid'
export default (props) => {
  let params = useParams()
  const LocationClip = params.clipNo
  let location = useLocation()
  const history = useHistory()
  var urlrStr = location.pathname.split('/')[2]
  //ctx
  const context = useContext(Context)
  const {webview} = qs.parse(location.search)
  //state
  const [thisBigIdx, setThisBigIdx] = useState(0)
  const [writeState, setWriteState] = useState(false)
  //modify msg
  const [modifyState, setModifyState] = useState(false)
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
      context.action.updateBoardIdx(boardIdx)
    }
  }
  //수정하기 토글
  const editToggle = (contents, boardIdx) => {
    context.action.updateBoardModifyInfo({
      clipNo: LocationClip,
      contents: contents,
      replyIdx: boardIdx
    })

    if (writeState === false) {
      setModifyState(true)
      setThisBigIdx(0)
      setModifyMsg(contents)
    } else {
      setModifyState(false)
    }
  }

  //삭제하기 fetch
  const deleteBoard = (boardIdx, clipMemNo) => {
    if (props.type === 'clip_board') {
      async function fetchDataDelete() {
        const res = await Api.postClipReplyDelete({
          clipNo: LocationClip,
          replyIdx: boardIdx
        })
        if (res.result === 'success') {
          setThisBigIdx(0)
          props.set(true)

          Hybrid('ClipUpdateInfo', res.data.clipPlayInfo)
        } else if (res.result === 'fail') {
          context.action.alert({
            callback: () => {},
            msg: res.message
          })
        }
      }
      fetchDataDelete()
    } else {
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
  }
  const Link = () => {
    if (props.type === 'clip_board') {
      if (webview) {
        context.token.memNo !== props.data.writerMemNo
          ? history.push(`/mypage/${props.data.writerMemNo}?webview=${webview}`)
          : history.push(`/menu/profile`)
      } else {
        context.token.memNo !== props.data.writerMemNo
          ? history.push(`/mypage/${props.data.writerMemNo}`)
          : history.push(`/menu/profile`)
      }
    } else {
      if (webview) {
        context.token.memNo !== props.data.writerNo
          ? history.push(`/mypage/${props.data.writerNo}?webview=${webview}`)
          : history.push(`/menu/profile`)
      } else {
        context.token.memNo !== props.data.writerNo
          ? history.push(`/mypage/${props.data.writerNo}`)
          : history.push(`/menu/profile`)
      }
    }
  }
  useEffect(() => {
    return () => {
      context.action.updateBoardIdx(0)
    }
  }, [])
  //팬보드 댓글 온체인지
  const handleChangeInput = (e) => {
    const target = e.currentTarget
    if (target.value.length > 100) return
    setModifyMsg(e.target.value)
  }
  useEffect(() => {
    if (context.boardModifyInfo && context.boardModifyInfo.replyIdx !== props.data.replyIdx) {
      setModifyState(false)
    }
  }, [context.boardModifyInfo])
  //수정하기 fetch
  async function editBoard() {
    const res = await Api.postClipReplyEdit({
      clipNo: LocationClip,
      contents: modifyMsg,
      replyIdx: props.data.replyIdx
    })
    if (res.result === 'success') {
      setModifyState(false)
      context.action.updateBoardIdx(0)
      context.action.updateBoardModifyInfo(null)

      Hybrid('ClipUpdateInfo', res.data.clipPlayInfo)
      props.set(true)
    } else if (res.result === 'fail') {
      context.action.alert({
        callback: () => {},
        msg: res.message
      })
    }
  }
  //접기 버튼
  const modifyCancel = () => {
    context.action.updateBoardIdx(0)
    setModifyState(false)
  }
  return (
    <>
      {modifyState === false && (
        <>
          <div className="list-item__header">
            {(urlrStr === context.token.memNo || props.data.writerNo === context.token.memNo) && props.type !== 'clip_board' ? (
              <>
                <button className="btn__more" onClick={() => moreToggle(props.data.boardIdx, props.data.contents)}></button>
                <div className={props.data.boardIdx === thisBigIdx ? 'moreList on' : 'moreList'}>
                  {/* {props.data.writerNo === context.token.memNo && (
                <button onClick={() => editToggle(props.data.contents, props.data.boardIdx)}>수정하기</button>
              )} */}
                  <button onClick={() => deleteBoard(props.data.boardIdx)}>삭제하기</button>
                </div>
              </>
            ) : props.data.writerMemNo === context.token.memNo || props.data.clipMemNo === context.token.memNo ? (
              <>
                <button className="btn__more" onClick={() => moreToggle(props.data.replyIdx, props.data.contents)}></button>
                <div className={context.boardIdx === props.data.replyIdx ? 'moreList on' : 'moreList'}>
                  {props.data.writerMemNo === context.token.memNo && (
                    <button onClick={() => editToggle(props.data.contents, props.data.replyIdx)}>수정하기</button>
                  )}
                  <button onClick={() => deleteBoard(props.data.replyIdx, props.data.clipMemNo)}>삭제하기</button>
                </div>
              </>
            ) : (
              <></>
            )}
            <span className="thumb" style={{backgroundImage: `url(${props.data.profImg.thumb190x190})`}} onClick={Link}></span>
            <span className="info" onClick={Link}>
              <span className="info__name">
                <em className={`${props.data.viewOn === 0 && 'info__lock'}`}></em>
                {props.data.nickNm || props.data.nickName}
              </span>
              <span className="info__dt">{timeFormat(props.data.writeDt)}</span>
            </span>
          </div>
          <div className="list-item__content">
            <pre>{props.data.contents}</pre>
          </div>
        </>
      )}
      {/* 수정하기 */}
      {modifyState === true && (
        <div className="writeWrap">
          <div className="writeWrap__top">
            <div className={`writeWrap__header ${writeState === true && 'writeWrap__header--active'}`}>
              <img src={props.data.profImg.thumb190x190} alt={props.data.nickName} />
              <strong>{props.data.nickName}</strong>
            </div>
            <div className="content_area">
              <textarea autoFocus="autofocus" value={modifyMsg} onChange={handleChangeInput} />
            </div>
          </div>
          <div className="writeWrap__btnWrap">
            <span className="countBox">
              <span className="count">
                <em>{modifyMsg.length}</em> / 100
              </span>
            </span>
            <button className="btn__ok" onClick={() => editBoard()}>
              수정
            </button>
            <div className="writeWrap__btn" onClick={modifyCancel}>
              <button className="btn__toggle">접기</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
